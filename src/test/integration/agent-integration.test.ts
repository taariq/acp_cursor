// ABOUTME: Integration test for real ACP agent communication
// ABOUTME: Tests full lifecycle: spawn, connect, initialize, session, prompt

import * as assert from 'assert';
import * as path from 'path';
import { AgentManager } from '../../acp/agent-manager';
import { ACPClient } from '../../acp/acp-client';

suite('ACP Agent Integration Tests', () => {
  test('Can communicate with example ACP agent', async function() {
    // This test spawns a real agent, so give it more time
    this.timeout(10000);

    const agentManager = new AgentManager();
    const acpClient = new ACPClient();

    // Path to the example agent in the SDK
    const agentPath = path.resolve(
      __dirname,
      '../../../node_modules/@agentclientprotocol/sdk/dist/examples/agent.js'
    );

    // Spawn the agent process (non-blocking for long-running agents)
    console.log('[Test] Spawning agent:', agentPath);
    const spawnResult = agentManager.spawnAgent('node', [agentPath]);

    assert.strictEqual(spawnResult.success, true, 'Agent should spawn successfully');
    assert.ok(spawnResult.process, 'Should have process handle');

    if (!spawnResult.process) {
      throw new Error('No process handle returned');
    }

    try {
      // Connect to the agent's stdio
      console.log('[Test] Connecting to agent...');
      await acpClient.connect(spawnResult.process.stdin!, spawnResult.process.stdout!);

      // Initialize the connection
      console.log('[Test] Initializing protocol...');
      const initResult = await acpClient.initialize();
      console.log('[Test] Initialize result:', initResult);

      assert.ok(initResult, 'Should receive initialization response');
      assert.strictEqual(initResult.protocolVersion, 1, 'Protocol version should be 1');

      // Create a new session
      console.log('[Test] Creating session...');
      const sessionResult = await acpClient.newSession(process.cwd());
      console.log('[Test] Session created:', sessionResult.sessionId);

      assert.ok(sessionResult.sessionId, 'Should receive session ID');

      // Send a prompt
      console.log('[Test] Sending prompt...');
      const promptResult = await acpClient.prompt(
        sessionResult.sessionId,
        'Hello, test agent!'
      );
      console.log('[Test] Prompt completed with:', promptResult.stopReason);

      assert.ok(promptResult, 'Should receive prompt response');
      assert.ok(promptResult.stopReason, 'Should have stop reason');

      console.log('[Test] ✅ All integration tests passed!');

    } finally {
      // Clean up: kill the agent process
      if (spawnResult.process) {
        spawnResult.process.kill();
        console.log('[Test] Agent process terminated');
      }
    }
  });
});