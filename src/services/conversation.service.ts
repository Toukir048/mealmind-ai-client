import { api } from './api';
import type {
  AssistantReply,
  Conversation,
  ConversationDetail,
  ConversationListResponse,
} from '../types/conversation';

export const getConversations = async (): Promise<ConversationListResponse> => {
  const { data } = await api.get<ConversationListResponse>('/ai/conversations', {
    params: { page: 1, limit: 40 },
  });
  return data;
};

export const createConversation = async (title: string): Promise<Conversation> => {
  const { data } = await api.post<{ data: Conversation }>('/ai/conversations', { title });
  return data.data;
};

export const getConversation = async (id: string): Promise<ConversationDetail> => {
  const { data } = await api.get<{ data: ConversationDetail }>(`/ai/conversations/${id}`);
  return data.data;
};

export const sendConversationMessage = async (
  id: string,
  content: string,
): Promise<AssistantReply> => {
  const { data } = await api.post<{ data: AssistantReply }>(
    `/ai/conversations/${id}/messages`,
    { content },
  );
  return data.data;
};

export const deleteConversation = async (id: string): Promise<void> => {
  await api.delete(`/ai/conversations/${id}`);
};
