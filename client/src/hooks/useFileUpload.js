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
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
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
