import MetricsService from '../services/MetricsService.js';
import ReportFactory, { ReportType } from '../services/reports/ReportFactory.js';

class ExportController {
  constructor() {
    this.metricsService = new MetricsService();
  }

  async exportToPDF(req, res, next) {
    try {
      const userId = req.userId;
      const filters = req.query;
      const filterName = req.query.filterName || null;

      console.log('Exporting dashboard to PDF for user:', userId);
      console.log('Received filters:', filters);
      console.log('Filter name:', filterName);

      const result = await this.metricsService.calculateDashboardMetrics(userId, filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      const metrics = result.metrics;

      // Use Factory to create PDF report
      const report = ReportFactory.createReport(ReportType.PDF, metrics, filters, filterName);
      await report.generate(res);

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      next(error);
    }
  }

  async exportToExcel(req, res, next) {
    try {
      const userId = req.userId;
      const filters = req.query;
      const filterName = req.query.filterName || null;

      console.log('Exporting dashboard to Excel for user:', userId);
      console.log('Received filters:', filters);
      console.log('Filter name:', filterName);

      const result = await this.metricsService.calculateDashboardMetrics(userId, filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      const metrics = result.metrics;

      // Use Factory to create Excel report
      const report = ReportFactory.createReport(ReportType.EXCEL, metrics, filters, filterName);
      await report.generate(res);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      next(error);
    }
  }
}

export default ExportController;
