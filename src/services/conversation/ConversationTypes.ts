/**
 * ShieldSight AI - Conversation Protection Types
 */

export interface MessageElement {
  id: string;
  timestamp: number;
  sender: 'incoming' | 'outgoing';
  text: string;
  platform: string;
  element: HTMLElement;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ConversationAdapter {
  platformName: string;
  canHandle(url: URL): boolean;
  discoverMessages(root?: HTMLElement): Promise<MessageElement[]>;
}
