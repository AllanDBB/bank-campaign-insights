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

const metricsService = {
  async getDashboardMetrics(filters = {}) {
    try {
      // Convert filters object to query string
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/metrics/dashboard?${queryString}` : '/metrics/dashboard';

      console.log('Fetching dashboard metrics from:', url);

      const response = await apiClient.get(url, {
        headers: getHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }
};

export default metricsService;
