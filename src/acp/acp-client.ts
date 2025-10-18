// ABOUTME: ACP client implementation using the official SDK
// ABOUTME: Manages connections and communication with ACP agents

import { ClientHandler } from './client-handler';
import { Writable, Readable } from 'stream';

export class ACPClient {
  private acpModule: any;
  private connection: any;
  private clientHandler: ClientHandler;

  constructor() {
    this.clientHandler = new ClientHandler();
  }

  private async loadSDK(): Promise<any> {
    if (!this.acpModule) {
      this.acpModule = await import('@agentclientprotocol/sdk');
    }
    return this.acpModule;
  }

  async getProtocolVersion(): Promise<number> {
    const acp = await this.loadSDK();
    return acp.PROTOCOL_VERSION;
  }

  async hasSDKAccess(): Promise<boolean> {
    try {
      const acp = await this.loadSDK();
      return typeof acp.ClientSideConnection !== 'undefined' &&
             typeof acp.ndJsonStream !== 'undefined';
    } catch (error) {
      return false;
    }
  }

  async connect(stdin: Writable, stdout: Readable): Promise<void> {
    const acp = await this.loadSDK();

    // Convert Node.js streams to Web streams
    const input = Writable.toWeb(stdin);
    const output = Readable.toWeb(stdout);

    // Create the ACP stream
    const stream = acp.ndJsonStream(input, output);

    // Create the connection with our client handler
    this.connection = new acp.ClientSideConnection(
      (_agent: any) => this.clientHandler,
      stream
    );
  }

  async initialize(): Promise<any> {
    if (!this.connection) {
      throw new Error('Connection not established. Call connect() first.');
    }

    const acp = await this.loadSDK();
    return await this.connection.initialize({
      protocolVersion: acp.PROTOCOL_VERSION,
      clientCapabilities: {
        fs: {
          readTextFile: true,
          writeTextFile: true
        }
      }
    });
  }

  async newSession(cwd: string): Promise<any> {
    if (!this.connection) {
      throw new Error('Connection not established. Call connect() first.');
    }

    return await this.connection.newSession({
      cwd,
      mcpServers: []
    });
  }

  async prompt(sessionId: string, text: string): Promise<any> {
    if (!this.connection) {
      throw new Error('Connection not established. Call connect() first.');
    }

    return await this.connection.prompt({
      sessionId,
      prompt: [
        {
          type: 'text',
          text
        }
      ]
    });
  }
}