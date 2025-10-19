// ABOUTME: VS Code extension entry point for ACP client
// ABOUTME: Registers commands and manages extension lifecycle

import * as vscode from 'vscode';
import * as path from 'path';
import { AgentLifecycle } from './acp/agent-lifecycle';

let agentLifecycle: AgentLifecycle;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('ACP Client extension is now active');

  agentLifecycle = new AgentLifecycle();

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(debug-stop) ACP Agent";
  statusBarItem.tooltip = "Click to start ACP agent";
  statusBarItem.command = 'acp.startAgent';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Start Agent command
  const startAgentCommand = vscode.commands.registerCommand('acp.startAgent', async () => {
    try {
      if (agentLifecycle.isRunning()) {
        vscode.window.showWarningMessage('ACP Agent is already running. Stop it first.');
        return;
      }

      // Get configuration
      const config = vscode.workspace.getConfiguration('acp');
      const agentCommand = config.get<string>('agentCommand', 'node');
      let agentArgs = config.get<string[]>('agentArgs', []);

      // Resolve relative paths in args to absolute paths
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (workspaceRoot) {
        agentArgs = agentArgs.map(arg => {
          if (arg.startsWith('node_modules/')) {
            return path.resolve(workspaceRoot, arg);
          }
          return arg;
        });
      }

      vscode.window.showInformationMessage('Starting ACP agent...');

      // Start the agent
      await agentLifecycle.startAgent(
        agentCommand,
        agentArgs,
        workspaceRoot || process.cwd()
      );

      // Update status bar
      statusBarItem.text = "$(check) ACP Agent";
      statusBarItem.tooltip = "ACP agent is running";
      statusBarItem.command = 'acp.stopAgent';

      vscode.window.showInformationMessage('ACP Agent started successfully!');

    } catch (error) {
      vscode.window.showErrorMessage(`Failed to start ACP agent: ${error}`);
      console.error('[Extension] Start agent error:', error);
    }
  });

  // Stop Agent command
  const stopAgentCommand = vscode.commands.registerCommand('acp.stopAgent', async () => {
    try {
      if (!agentLifecycle.isRunning()) {
        vscode.window.showWarningMessage('No ACP agent is running.');
        return;
      }

      agentLifecycle.stopAgent();

      // Update status bar
      statusBarItem.text = "$(debug-stop) ACP Agent";
      statusBarItem.tooltip = "Click to start ACP agent";
      statusBarItem.command = 'acp.startAgent';

      vscode.window.showInformationMessage('ACP Agent stopped.');

    } catch (error) {
      vscode.window.showErrorMessage(`Failed to stop ACP agent: ${error}`);
      console.error('[Extension] Stop agent error:', error);
    }
  });

  context.subscriptions.push(startAgentCommand, stopAgentCommand);
}

export function deactivate() {
  console.log('ACP Client extension deactivated');
  if (agentLifecycle && agentLifecycle.isRunning()) {
    agentLifecycle.stopAgent();
  }
}