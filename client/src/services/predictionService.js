import apiClient from './api';

const authHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`
  };
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
