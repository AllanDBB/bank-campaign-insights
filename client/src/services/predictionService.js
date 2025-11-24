import apiClient from './api';

const getUserId = () => import.meta.env.VITE_USER_ID;

const authHeaders = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('User ID not configured. Please set VITE_USER_ID in your .env file');
  }
  return { 'x-user-id': userId };
};

export const scoreProspect = async (payload) => {
  const response = await apiClient.post('/prediction/score', payload, {
    headers: authHeaders()
  });
  return response.data;
};

export const getInterpretationConfig = async () => {
  const response = await apiClient.get('/prediction/config', {
    headers: authHeaders()
  });
  return response.data;
};

export const updateInterpretationConfig = async (payload) => {
  const response = await apiClient.put('/prediction/config', payload, {
    headers: authHeaders()
  });
  return response.data;
};
