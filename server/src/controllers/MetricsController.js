import MetricsService from '../services/MetricsService.js';

class MetricsController {
  constructor() {
    this.metricsService = new MetricsService();
  }

  async getDashboardMetrics(req, res, next) {
    try {
      const userId = req.userId;
      const filters = req.query;

      console.log('Calculating dashboard metrics for user:', userId);
      console.log('Applied filters:', filters);

      const result = await this.metricsService.calculateDashboardMetrics(userId, filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.metrics
      });
    } catch (error) {
      console.error('Error in getDashboardMetrics:', error);
      next(error);
    }
  }
}

export default MetricsController;
