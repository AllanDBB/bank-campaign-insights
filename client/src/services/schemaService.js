import apiClient from './api';

const getHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`
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
