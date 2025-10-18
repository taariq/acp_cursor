# ACP Client Extension for Cursor - Project Conversation

## Project Overview
Building a VS Code/Cursor extension that implements the Agent Client Protocol (ACP) to enable Claude Code and other ACP-compatible agents to work directly in Cursor.

---

## Conversation History

### Initial Request
**User:** How do i setup https://agentclientprotocol.com/overview/introduction to work with cursor?

**Assistant:** Research findings:
- ACP (Agent Client Protocol) is from Zed Industries
- Standardizes communication between code editors and AI coding agents
- **Current Status**: Cursor does NOT support ACP
- **Editors with ACP Support**: Zed, Neovim, Emacs, JetBrains (coming soon)
- **Agents with ACP Support**: Claude Code, Gemini CLI, Codex, Goose

### Clarification
**User:** You confused Agent Client Protocol ACP with Agent Communication Protocol ACP. We want to use ACP from Zed in Cursor with Claude Code.

**Assistant:** Correction confirmed:
- Agent Client Protocol = The protocol from Zed for editor-to-agent communication
- This is what we need to implement in Cursor
- Cursor currently has NO ACP support

### Exploration of Alternatives
**User:** Can we use agent-shell.el as a way to emulate ACP in cursor?

**Assistant:** Analysis:
- agent-shell.el is Emacs-specific (written in Emacs Lisp)
- Cannot be directly used in Cursor (VS Code-based)
- However, the APPROACH is replicable:
  - Uses ACP TypeScript SDK (`@zed-industries/agent-client-protocol`)
  - Spawns agents as subprocesses
  - Communicates via JSON-RPC over stdio
  - Could build similar extension for Cursor

### Decision to Build
**User:** Let's build the cursor extension!!!!

**Assistant:** Started planning with zen:planner tool

---

## Project Specification

### Goal
Create a VS Code extension that implements ACP client support, allowing Cursor users to interact with ACP-compatible agents (Claude Code, Gemini CLI, Codex) directly within the editor.

### Key Technical Components
1. **ACP Client Core** - Using @zed-industries/agent-client-protocol SDK
2. **Agent Process Management** - Spawn and manage agent subprocesses
3. **VS Code Extension API Integration** - Commands, views, webviews
4. **UI Layer** - Chat interface, diff viewer, permission prompts
5. **Configuration** - Agent server settings (similar to Zed's config)

### Proposed Architecture
- Extension spawns ACP agents as child processes
- Communicate via JSON-RPC over stdio
- Use VS Code webview for chat interface
- Leverage VS Code diff editor for code changes
- Store configuration in workspace/user settings

### Initial Project Structure
```
acp-client-extension/
├── src/
│   ├── extension.ts          # VS Code extension entry point
│   ├── acp/
│   │   ├── client.ts          # ACP client implementation
│   │   ├── agent-manager.ts   # Spawn/manage agent processes
│   │   └── types.ts           # TypeScript types
│   ├── ui/
│   │   ├── chat-panel.ts      # Chat webview
│   │   └── diff-viewer.ts     # Diff handling
│   └── config/
│       └── agent-config.ts    # Agent server configuration
├── test/
├── package.json
├── tsconfig.json
└── README.md
```

### Required Dependencies
- `@zed-industries/agent-client-protocol` - Official ACP SDK
- `vscode` types - For VS Code extension API
- Testing framework (likely `@vscode/test-electron`)

### Development Approach (TDD)
1. Start with simplest possible test: "Can we spawn the ACP example agent?"
2. Implement just enough to make it pass
3. Build up functionality iteratively

---

## Key Resources

### Documentation Links
- **ACP Protocol**: https://agentclientprotocol.com
- **ACP GitHub**: https://github.com/zed-industries/agent-client-protocol
- **ACP TypeScript SDK**: https://www.npmjs.com/package/@zed-industries/agent-client-protocol
- **TypeScript Examples**: https://github.com/zed-industries/agent-client-protocol/tree/main/typescript/examples
- **Claude Code ACP Adapter**: https://github.com/zed-industries/claude-code-acp
- **VS Code Extension API**: https://code.visualstudio.com/api

### Related Implementations for Reference
- **Zed's External Agents**: https://zed.dev/docs/ai/external-agents
- **agent-shell.el** (Emacs): https://github.com/xenodium/agent-shell
- **acp.el** (Emacs): https://github.com/xenodium/acp.el
- **CodeCompanion** (Neovim): ACP-compatible plugin
- **Avante.nvim** (Neovim): ACP-compatible plugin

### Community Interest
- VS Code ACP support issue: https://github.com/microsoft/vscode/issues/265496 (65+ upvotes)
- Zed blog on ACP adoption: https://zed.dev/blog/acp-progress-report

---

## Open Questions for Repository Setup

1. **Project Location**: Where to create the extension project?
2. **Git Repository**: Initialize new repo or part of existing?
3. **Extension Type**: Standalone or part of monorepo?
4. **Initial Scope**: MVP with Claude Code only, or multi-agent from start?

---

## Next Steps

1. Create repository structure
2. Initialize git
3. Set up package.json with dependencies
4. Configure TypeScript
5. Write first failing test (TDD)
6. Implement ACP client core
7. Build agent process manager
8. Create basic UI (chat panel)
9. Add configuration support
10. Test with Claude Code

---

## Notes

- This is an ambitious but achievable project
- ACP protocol is still relatively new (launched August 2025)
- Reference implementations exist in TypeScript (Zed's adapters)
- VS Code has similar patterns with MCP (Model Context Protocol) support
- Community clearly wants this feature (65+ GitHub upvotes)

---

*Conversation exported for continuation in Claude Code*
*Ready to initialize repository and begin implementation*