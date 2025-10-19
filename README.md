# ACP Client for Cursor

Implements the [Agent Client Protocol (ACP)](https://agentclientprotocol.com) as a VS Code/Cursor extension, enabling ACP-compatible agents to work directly in Cursor.

## Installation

### Prerequisites
- Node.js 20.x or higher
- VS Code or Cursor editor

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd acp_cursor
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run compile
   ```

3. **Run in development:**
   - Open project in VS Code/Cursor
   - Press `F5` to launch Extension Development Host
   - New window opens with extension loaded

## Development

### Build Commands

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode (auto-recompile on changes)
- `npm test` - Run unit tests
- `npm run test:integration` - Run integration tests

### Testing the Extension

**Method 1: Extension Development Host (F5)**
1. Press `F5` in VS Code/Cursor
2. New window opens with "[Extension Development Host]" in title
3. Look for "ACP Agent" status bar item (bottom left)
4. Click it or run "ACP: Start Agent" from Command Palette
5. Check Debug Console for agent communication logs

**Method 2: Install as .vsix**
1. Package the extension:
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```
2. In Cursor: Extensions → "..." menu → "Install from VSIX..."
3. Select generated `acp-cursor-0.0.1.vsix` file
4. Reload window (`Cmd+Shift+P` → "Developer: Reload Window")

### Configuration

Configure agent command and arguments in VS Code settings:

```json
{
  "acp.agentCommand": "node",
  "acp.agentArgs": [
    "node_modules/@agentclientprotocol/sdk/dist/examples/agent.js"
  ]
}
```

## Current Status

**Implemented:**
- Agent process spawning and lifecycle management
- JSON-RPC communication over stdio
- Protocol initialization and session creation
- Status bar UI (click to start/stop agent)
- Configuration via VS Code settings

**In Progress:**
- Chat UI webview
- Diff viewer integration
- Permission prompts for agent file operations

## Architecture

**Core Components:**
- [AgentLifecycle](src/acp/agent-lifecycle.ts) - Agent startup, session management, shutdown
- [AgentManager](src/acp/agent-manager.ts) - Process spawning
- [ACPClient](src/acp/acp-client.ts) - Protocol communication
- [Extension](src/extension.ts) - VS Code integration

## Resources

- [ACP Protocol Documentation](https://agentclientprotocol.com)
- [ACP TypeScript SDK](https://github.com/zed-industries/agent-client-protocol)
- [Claude Code ACP Adapter](https://github.com/zed-industries/claude-code-acp)
