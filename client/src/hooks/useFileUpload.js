import { useState } from 'react';
import { uploadDocument } from '../services/documentService';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

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
      const result = await uploadDocument(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadResult(result);
      setIsUploading(false);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
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
