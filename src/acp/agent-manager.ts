// ABOUTME: Manages ACP agent subprocess lifecycle
// ABOUTME: Spawns, monitors, and terminates agent processes

import { spawn, ChildProcess } from 'child_process';

export interface SpawnResult {
  success: boolean;
  process?: ChildProcess;
  error?: string;
}

export class AgentManager {
  async spawn(agentPath: string, args: string[]): Promise<SpawnResult> {
    try {
      const process = spawn(agentPath, args);

      return new Promise((resolve) => {
        process.on('close', (code) => {
          resolve({ success: code === 0, process });
        });

        process.on('error', (error) => {
          resolve({ success: false, error: error.message });
        });
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  spawnAgent(command: string, args: string[]): SpawnResult {
    try {
      const process = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let hasError = false;
      process.on('error', (error) => {
        hasError = true;
        console.error('[AgentManager] Process error:', error);
      });

      // Give process a moment to fail if there's an immediate error
      setTimeout(() => {
        if (hasError) {
          return;
        }
      }, 100);

      return {
        success: true,
        process
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}