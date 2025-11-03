import PDFDocument from 'pdfkit';
import BaseReport from './BaseReport.js';

/**
 * Concrete implementation for PDF reports
 */
class PDFReport extends BaseReport {
  constructor(metrics, filters, filterName) {
    super(metrics, filters, filterName);
  }

  /**
   * Generate PDF report
   */
  async generate(res) {
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard-export.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Add header
    this.addHeader(doc);

    // Add filters section if applicable
    if (this.hasFilters()) {
      this.addFiltersSection(doc);
    }

    // Add content sections
    this.addKPIsSection(doc);
    this.addContactTypeSection(doc);
    this.addAgeDistributionSection(doc);
    this.addMaritalStatusSection(doc);
    this.addSubscriptionResultsSection(doc);

    // Finalize PDF
    doc.end();
  }

  /**
   * Add document header
   */
  addHeader(doc) {
    doc.fontSize(20).text('Dashboard Bancario - Reporte', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown(2);
  }

  /**
   * Add filters section
   */
  addFiltersSection(doc) {
    const actualFilters = this.getActualFilters();

    doc.fontSize(16).text('Filtros Aplicados', { underline: true });
    doc.moveDown();

    if (this.filterName) {
      doc.fontSize(12).text(`Nombre del Filtro: ${this.filterName}`, { bold: true });
      doc.moveDown(0.5);
    }

    if (actualFilters.length > 0) {
      doc.fontSize(11);
      const filterLabels = this.getFilterLabels();

      Object.entries(this.filters).forEach(([key, value]) => {
        if (key !== 'filterName' && value !== undefined && value !== null && value !== '') {
          const label = filterLabels[key] || key;
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          doc.text(`${label}: ${displayValue}`);
        }
      });
    } else if (this.filterName) {
      doc.fontSize(11).text('Sin filtros específicos aplicados');
    }

    doc.moveDown(2);
  }

  /**
   * Add KPIs section
   */
  addKPIsSection(doc) {
    doc.fontSize(16).text('KPIs Principales', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Tasa de Conversión: ${this.metrics.cr?.toFixed(2) || 0}%`);
    doc.text(`Total de Contactos: ${this.metrics.totalCalls || 0}`);
    doc.text(`Duración Media de Llamadas: ${this.metrics.callAvg || 0} segundos`);
    doc.text(`Llamadas Exitosas: ${this.metrics.successfulCalls || 0}`);
    doc.text(`Llamadas No Exitosas: ${this.metrics.unsuccessfulCalls || 0}`);
    doc.moveDown(2);
  }

  /**
   * Add contact type section
   */
  addContactTypeSection(doc) {
    doc.fontSize(16).text('Información de Contacto', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    if (this.metrics.contactType && this.metrics.contactType.length > 0) {
      const contact = this.metrics.contactType[0];
      doc.text(`Contactos por Celular: ${contact.Celular || 0}`);
      doc.text(`Contactos por Teléfono: ${contact.Telefono || 0}`);
    }
    doc.moveDown(2);
  }

  /**
   * Add age distribution section
   */
  addAgeDistributionSection(doc) {
    doc.fontSize(16).text('Distribución por Edad', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    if (this.metrics.ageDistribution && this.metrics.ageDistribution.length > 0) {
      this.metrics.ageDistribution.forEach(item => {
        doc.text(`${item.name}: ${item.value} contactos`);
      });
    }
    doc.moveDown(2);
  }

  /**
   * Add marital status section
   */
  addMaritalStatusSection(doc) {
    doc.fontSize(16).text('Estado Civil', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    if (this.metrics.maritalStatus && this.metrics.maritalStatus.length > 0) {
      this.metrics.maritalStatus.slice(0, 5).forEach(item => {
        doc.text(`${item.name}: ${item.value} contactos`);
      });
    }
    doc.moveDown(2);
  }

  /**
   * Add subscription results section
   */
  addSubscriptionResultsSection(doc) {
    doc.fontSize(16).text('Resultados de Suscripción', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    if (this.metrics.callSubscription && this.metrics.callSubscription.length > 0) {
      this.metrics.callSubscription.forEach(item => {
        doc.text(`${item.name}: ${item.value} contactos`);
      });
    }
  }
}

export default PDFReport;
