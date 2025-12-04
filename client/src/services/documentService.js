import apiClient from './api';

/**
 * NOTE: Phase 1 Implementation
 * Uses hardcoded user ID from environment variable for document isolation
 * Phase 2 will implement JWT authentication to extract user ID from token
 */

/**
 * Upload a document file
 */
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    }
  };

  const response = await apiClient.post('/documents/upload', formData, config);
  return response.data;
};

/**
 * Get all documents for the current user
 */
export const getDocuments = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await apiClient.get('/documents', config);

    // Backend returns { success: true, data: [], pagination: {} }
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};