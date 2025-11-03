import PDFReport from './PDFReport.js';
import ExcelReport from './ExcelReport.js';

/**
 * Report types enum
 */
export const ReportType = {
  PDF: 'PDF',
  EXCEL: 'EXCEL'
};

/**
 * Factory class for creating report instances
 * Implements the Factory Pattern
 */
class ReportFactory {
  /**
   * Create a report instance based on type
   * @param {string} type - Type of report (PDF or EXCEL)
   * @param {Object} metrics - Dashboard metrics data
   * @param {Object} filters - Applied filters
   * @param {string} filterName - Name of the filter
   * @returns {BaseReport} Report instance
   * @throws {Error} If report type is unknown
   */
  static createReport(type, metrics, filters, filterName) {
    switch (type.toUpperCase()) {
      case ReportType.PDF:
        return new PDFReport(metrics, filters, filterName);
      
      case ReportType.EXCEL:
        return new ExcelReport(metrics, filters, filterName);
      
      default:
        throw new Error(`Unknown report type: ${type}. Supported types are: PDF, EXCEL`);
    }
  }

  /**
   * Get list of supported report types
   * @returns {Array<string>} List of supported types
   */
  static getSupportedTypes() {
    return Object.values(ReportType);
  }

  /**
   * Check if a report type is supported
   * @param {string} type - Report type to check
   * @returns {boolean} True if supported
   */
  static isTypeSupported(type) {
    return Object.values(ReportType).includes(type.toUpperCase());
  }
}

export default ReportFactory;
