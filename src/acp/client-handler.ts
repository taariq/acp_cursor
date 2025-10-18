// ABOUTME: Implementation of ACP Client interface
// ABOUTME: Handles requests from agents for permissions, file operations, and session updates

export class ClientHandler {
  async requestPermission(params: any): Promise<any> {
    console.log('[ClientHandler] Permission requested:', params);
    // For now, auto-approve the first option
    if (params.options && params.options.length > 0) {
      return {
        outcome: {
          outcome: 'selected',
          optionId: params.options[0].optionId
        }
      };
    }
    return {
      outcome: {
        outcome: 'cancelled'
      }
    };
  }

  async sessionUpdate(params: any): Promise<void> {
    console.log('[ClientHandler] Session update:', params.update.sessionUpdate);
    // Handle different update types
    const update = params.update;
    switch (update.sessionUpdate) {
      case 'agent_message_chunk':
        if (update.content?.type === 'text') {
          console.log('[Agent]:', update.content.text);
        }
        break;
      case 'tool_call':
        console.log('[Tool Call]:', update.title, '-', update.status);
        break;
      default:
        break;
    }
  }

  async readTextFile(params: any): Promise<any> {
    console.log('[ClientHandler] Read text file:', params.path);
    // For now, return empty content
    return {
      content: ''
    };
  }

  async writeTextFile(params: any): Promise<any> {
    console.log('[ClientHandler] Write text file:', params.path);
    return {};
  }

  async createTerminal(params: any): Promise<any> {
    console.log('[ClientHandler] Create terminal:', params);
    throw new Error('Terminal creation not yet implemented');
  }
}