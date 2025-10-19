// ABOUTME: Manages the lifecycle of an ACP agent connection
// ABOUTME: Handles spawning, initialization, session management, and cleanup

import { AgentManager, SpawnResult } from './agent-manager';
import { ACPClient } from './acp-client';

export interface AgentState {
  isRunning: boolean;
  sessionId?: string;
  agentCommand?: string;
  agentArgs?: string[];
}

export class AgentLifecycle {
  private agentManager: AgentManager;
  private acpClient: ACPClient;
  private spawnResult?: SpawnResult;
  private state: AgentState;

  constructor() {
    this.agentManager = new AgentManager();
    this.acpClient = new ACPClient();
    this.state = {
      isRunning: false
    };
  }

  async startAgent(command: string, args: string[], cwd: string): Promise<void> {
    if (this.state.isRunning) {
      throw new Error('Agent is already running. Stop it first.');
    }

    // Spawn the agent process
    this.spawnResult = this.agentManager.spawnAgent(command, args);

    if (!this.spawnResult.success || !this.spawnResult.process) {
      throw new Error(`Failed to spawn agent: ${this.spawnResult.error}`);
    }

    // Connect to the agent
    await this.acpClient.connect(
      this.spawnResult.process.stdin!,
      this.spawnResult.process.stdout!
    );

    // Initialize the protocol
    const initResult = await this.acpClient.initialize();
    console.log('[AgentLifecycle] Initialized with protocol version:', initResult.protocolVersion);

    // Create a session
    const sessionResult = await this.acpClient.newSession(cwd);
    console.log('[AgentLifecycle] Session created:', sessionResult.sessionId);

    this.state = {
      isRunning: true,
      sessionId: sessionResult.sessionId,
      agentCommand: command,
      agentArgs: args
    };
  }

  async sendPrompt(text: string): Promise<any> {
    if (!this.state.isRunning || !this.state.sessionId) {
      throw new Error('No active agent session. Start an agent first.');
    }

    return await this.acpClient.prompt(this.state.sessionId, text);
  }

  stopAgent(): void {
    if (this.spawnResult?.process) {
      this.spawnResult.process.kill();
      console.log('[AgentLifecycle] Agent process terminated');
    }

    this.state = {
      isRunning: false
    };
  }

  getState(): AgentState {
    return { ...this.state };
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }
}