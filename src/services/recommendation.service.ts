import { api } from './api';
import type {
  RecommendationFeedback,
  RecommendationRequest,
  RecommendationResult,
} from '../types/recommendation';

export const requestRecommendations = async (
  input: RecommendationRequest,
): Promise<RecommendationResult> => {
  const { data } = await api.post<{ data: RecommendationResult }>('/ai/recommendations', input);
  return data.data;
};

export const sendRecommendationFeedback = async (input: {
  recommendationId: string;
  recipeId: string;
  feedback: RecommendationFeedback;
}): Promise<void> => {
  await api.post('/ai/recommendations/feedback', input);
};
