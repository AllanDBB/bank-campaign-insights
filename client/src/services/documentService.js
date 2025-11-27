import apiClient from './api';

/**
 * NOTE: Phase 1 Implementation
 * Uses hardcoded user ID from environment variable for document isolation
 * Phase 2 will implement JWT authentication to extract user ID from token
 */

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // Obtener token del localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. User must log in.");
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`  // JWT
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  };

  const response = await apiClient.post('/documents/upload', formData, config);
  return response.data;
};
