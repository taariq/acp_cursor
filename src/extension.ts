// ABOUTME: VS Code extension entry point for ACP client
// ABOUTME: Registers commands and manages extension lifecycle

import * as vscode from 'vscode';
import { AgentManager } from './acp/agent-manager';
import { ACPClient } from './acp/acp-client';

export function activate(context: vscode.ExtensionContext) {
  console.log('ACP Client extension is now active');

  const agentManager = new AgentManager();
  const acpClient = new ACPClient();

  const startAgentCommand = vscode.commands.registerCommand('acp.startAgent', async () => {
    const version = await acpClient.getProtocolVersion();
    vscode.window.showInformationMessage(`ACP Client Protocol Version: ${version}`);
  });

  context.subscriptions.push(startAgentCommand);
}

export function deactivate() {
  console.log('ACP Client extension deactivated');
}