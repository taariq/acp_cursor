// ABOUTME: Tests for agent process spawning and management
// ABOUTME: Validates AgentManager can spawn and communicate with ACP agents

import * as assert from 'assert';
import { AgentManager } from '../acp/agent-manager';

suite('AgentManager Test Suite', () => {
  test('Can spawn a simple echo process', async () => {
    const manager = new AgentManager();
    const agentPath = '/bin/echo';
    const args = ['hello'];

    const result = await manager.spawn(agentPath, args);

    assert.strictEqual(result.success, true);
  });
});