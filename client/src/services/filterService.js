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

const filterService = {
  async getAllFilters() {
    try {
      const response = await apiClient.get('/filters', {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  },

  async getFilterById(id) {
    try {
      const response = await apiClient.get(`/filters?id=${id}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching filter:', error);
      throw error;
    }
  },

  async createFilter(filterData) {
    try {
      const response = await apiClient.post('/filters', filterData, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating filter:', error);
      throw error;
    }
  },

  async updateFilter(id, filterData) {
    try {
      const response = await apiClient.put(`/filters/${id}`, filterData, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating filter:', error);
      throw error;
    }
  },

  async deleteFilter(id) {
    try {
      const response = await apiClient.delete(`/filters/${id}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting filter:', error);
      throw error;
    }
  }
};

export default filterService;
