import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const simulateProgress = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10; 
        if (progress >= 90) {
          clearInterval(interval);
          setUploadProgress(90);
          resolve();
        } else {
          setUploadProgress(Math.min(progress, 90));
        }
      }, 1500); // Más lento (1500ms vs 800ms)
    });
  };

  const upload = async (file) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const progressSimulation = simulateProgress();

      const result = await uploadDocument(file);

      await progressSimulation;

      setUploadProgress(100);

      await new Promise(resolve => setTimeout(resolve, 500));

      setUploadResult(result);
      setIsUploading(false);
      return result;
    } catch (err) {
      let errorMessage = 'Upload failed';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.response?.status === 404 && errorMessage.includes('User not found')) {
        errorMessage = 'User not registered. Please create a user account first.';
      } else if (err.response?.status === 401 && errorMessage.includes('Missing x-user-id')) {
        errorMessage = 'User ID not configured. Please set VITE_USER_ID in your .env file.';
      } else if (err.response?.status === 404 && errorMessage.includes('Invalid user ID')) {
        errorMessage = 'Invalid user ID. Please verify your VITE_USER_ID in .env file.';
      }

      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
      throw err;
    }
  };

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
  };

  return {
    upload,
    reset,
    isUploading,
    uploadProgress,
    uploadResult,
    error,
  };
};
