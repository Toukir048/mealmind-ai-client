import type { RecipeSummary } from './recipe';

export interface Conversation {
  _id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  recipeIds: string[];
  suggestedQuestions: string[];
  createdAt: string;
}

export interface ConversationListResponse {
  data: Conversation[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ConversationDetail {
  conversation: Conversation;
  messages: ChatMessage[];
  recipes: RecipeSummary[];
}

export interface AssistantReply {
  message: ChatMessage;
  recipes: RecipeSummary[];
}
