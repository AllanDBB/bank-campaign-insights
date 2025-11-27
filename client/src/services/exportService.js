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

const exportService = {
  async exportToPDF(filters = {}) {
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
      const url = queryString ? `/export/pdf?${queryString}` : '/export/pdf';

      console.log('Exporting to PDF:', url);

      const response = await apiClient.get(url, {
        headers: getHeaders(),
        responseType: 'blob' // Important for binary data
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  },

  async exportToExcel(filters = {}) {
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
      const url = queryString ? `/export/excel?${queryString}` : '/export/excel';

      console.log('Exporting to Excel:', url);

      const response = await apiClient.get(url, {
        headers: getHeaders(),
        responseType: 'blob' // Important for binary data
      });

      // Create blob from response
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `dashboard-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }
};

export default exportService;
