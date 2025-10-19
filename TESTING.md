# Testing the ACP Extension in Cursor

## Prerequisites

1. The extension is built: `npm run compile`
2. You're in the project directory

## Method 1: Launch Extension Development Host

1. **Open the project in Cursor**
   - Already done! ✓

2. **Press F5** (or Run > Start Debugging)
   - This will launch a new Cursor window with the extension loaded
   - Look for "[Extension Development Host]" in the title bar

3. **Test Agent Spawning**
   - Look for the status bar item: "$(debug-stop) ACP Agent" (bottom left)
   - Click it or use Command Palette: "ACP: Start Agent"
   - You should see:
     * "Starting ACP agent..." notification
     * Status bar changes to "$(check) ACP Agent"
     * "ACP Agent started successfully!" notification
   - Check the Debug Console for agent communication logs

4. **Test Agent Stopping**
   - Click the status bar item (now shows green checkmark)
   - Or use Command Palette: "ACP: Stop Agent"
   - Status bar returns to "$(debug-stop) ACP Agent"
   - "ACP Agent stopped." notification

## Method 2: Install Locally (More Permanent)

1. **Package the extension**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. **Install the .vsix file**
   - In Cursor: Extensions view (Cmd+Shift+X)
   - Click "..." menu → "Install from VSIX..."
   - Select the generated `acp-cursor-0.0.1.vsix` file

3. **Reload Cursor**
   - Press `Cmd+Shift+P` → "Developer: Reload Window"

4. **Test the command** (same as above)

## What to Test

### Basic Functionality
- [ ] Extension activates without errors
- [ ] "ACP: Start Agent" command appears in command palette
- [ ] Command shows success message with protocol version

### Integration Test (In Extension Development Host)
- [ ] Open Debug Console (View > Debug Console)
- [ ] Run integration test: `npm test`
- [ ] Verify all 5 tests pass
- [ ] Check console output shows agent communication

## Current Limitations

⚠️ The current extension only shows a message with the protocol version.

**To actually use an ACP agent**, we need to:
1. Configure which agent to run (claude-code-acp, etc.)
2. Spawn the agent when command is invoked
3. Build UI for chat interaction

## Next Steps After Testing

If basic functionality works, we can add:
- Configuration for agent path
- Chat panel UI
- Real-time agent communication
- File operations integration