import apiClient from './api';

/**
 * NOTE: Phase 1 Implementation
 * Uses hardcoded user ID from environment variable for document isolation
 * Phase 2 will implement JWT authentication to extract user ID from token
 */

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // Phase 1: Get user ID from environment variable
  // Phase 2: This will be extracted from JWT token
  const userId = import.meta.env.VITE_USER_ID;

  if (!userId) {
    throw new Error('User ID not configured. Please set VITE_USER_ID in your .env file');
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-user-id': userId, // Send user ID in header for multi-tenant support
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  };

  const response = await apiClient.post('/documents/upload', formData, config);
  return response.data;
};
