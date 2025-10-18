// ABOUTME: Tests for ACP client connection and initialization
// ABOUTME: Validates that we can connect to and communicate with ACP agents

import * as assert from 'assert';
import { ACPClient } from '../acp/acp-client';

suite('ACPClient Test Suite', () => {
  test('Can create an ACP client instance', () => {
    const client = new ACPClient();
    assert.ok(client);
  });

  test('Can initialize protocol version', async () => {
    const client = new ACPClient();
    const version = await client.getProtocolVersion();
    assert.ok(version);
    assert.strictEqual(typeof version, 'string');
  });
});