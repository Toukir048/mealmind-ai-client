import { api } from './api';
import type { UserPreference } from '../types/preference';

export const getPreferences = async (): Promise<UserPreference> => {
  const { data } = await api.get<{ data: UserPreference }>('/preferences');
  return data.data;
};
export const updatePreferences = async (input: UserPreference): Promise<UserPreference> => {
  const { data } = await api.put<{ data: UserPreference }>('/preferences', input);
  return data.data;
};
