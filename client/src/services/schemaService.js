import apiClient from './api';

const getHeaders = () => {
  const userId = import.meta.env.VITE_USER_ID;

  if (!userId) {
    throw new Error('User ID not configured. Please set VITE_USER_ID in your .env file');
  }

  return {
    'x-user-id': userId
  };
};

const schemaService = {
  async getDocumentSchema() {
    try {
      const response = await apiClient.get('/schema/documents', {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching schema:', error);
      throw error;
    }
  }
};

export default schemaService;
