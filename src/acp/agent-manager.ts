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
}