import axios from 'axios';

interface ErrorEnvelope {
  error?: { message?: string };
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ErrorEnvelope>(error)) {
    return error.response?.data.error?.message ??
      (error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : fallback);
  }
  return error instanceof Error ? error.message : fallback;
};
