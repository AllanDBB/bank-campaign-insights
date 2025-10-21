import MetricsService from '../services/MetricsService.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

class ExportController {
  constructor() {
    this.metricsService = new MetricsService();
  }

  async exportToPDF(req, res, next) {
    try {
      const userId = req.userId;
      const filters = req.query;

      console.log('Exporting dashboard to PDF for user:', userId);

      const result = await this.metricsService.calculateDashboardMetrics(userId, filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      const metrics = result.metrics;

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=dashboard-export.pdf');

      // Pipe PDF to response
      doc.pipe(res);

      // Add content to PDF
      doc.fontSize(20).text('Dashboard Bancario - Reporte', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
      doc.moveDown(2);

      // KPIs Section
      doc.fontSize(16).text('KPIs Principales', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      doc.text(`Tasa de Conversión: ${metrics.cr?.toFixed(2) || 0}%`);
      doc.text(`Total de Contactos: ${metrics.totalCalls || 0}`);
      doc.text(`Duración Media de Llamadas: ${metrics.callAvg || 0} segundos`);
      doc.text(`Llamadas Exitosas: ${metrics.successfulCalls || 0}`);
      doc.text(`Llamadas No Exitosas: ${metrics.unsuccessfulCalls || 0}`);
      doc.moveDown(2);

      // Contact Type Section
      doc.fontSize(16).text('Información de Contacto', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      if (metrics.contactType && metrics.contactType.length > 0) {
        const contact = metrics.contactType[0];
        doc.text(`Contactos por Celular: ${contact.Celular || 0}`);
        doc.text(`Contactos por Teléfono: ${contact.Telefono || 0}`);
      }
      doc.moveDown(2);

      // Age Distribution
      doc.fontSize(16).text('Distribución por Edad', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      if (metrics.ageDistribution && metrics.ageDistribution.length > 0) {
        metrics.ageDistribution.forEach(item => {
          doc.text(`${item.name}: ${item.value} contactos`);
        });
      }
      doc.moveDown(2);

      // Marital Status
      doc.fontSize(16).text('Estado Civil', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      if (metrics.maritalStatus && metrics.maritalStatus.length > 0) {
        metrics.maritalStatus.slice(0, 5).forEach(item => {
          doc.text(`${item.name}: ${item.value} contactos`);
        });
      }
      doc.moveDown(2);

      // Subscription Results
      doc.fontSize(16).text('Resultados de Suscripción', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      if (metrics.callSubscription && metrics.callSubscription.length > 0) {
        metrics.callSubscription.forEach(item => {
          doc.text(`${item.name}: ${item.value} contactos`);
        });
      }

      // Finalize PDF
      doc.end();

    } catch (error) {
      console.error('Error exporting to PDF:', error);
      next(error);
    }
  }

  async exportToExcel(req, res, next) {
    try {
      const userId = req.userId;
      const filters = req.query;

      console.log('Exporting dashboard to Excel for user:', userId);

      const result = await this.metricsService.calculateDashboardMetrics(userId, filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      const metrics = result.metrics;

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Bank Campaign Insights';
      workbook.created = new Date();

      // KPIs Sheet
      const kpisSheet = workbook.addWorksheet('KPIs Principales');
      kpisSheet.columns = [
        { header: 'Métrica', key: 'metric', width: 40 },
        { header: 'Valor', key: 'value', width: 20 }
      ];

      kpisSheet.addRows([
        { metric: 'Tasa de Conversión (%)', value: metrics.cr?.toFixed(2) || 0 },
        { metric: 'Total de Contactos', value: metrics.totalCalls || 0 },
        { metric: 'Duración Media de Llamadas (seg)', value: metrics.callAvg || 0 },
        { metric: 'Llamadas Exitosas', value: metrics.successfulCalls || 0 },
        { metric: 'Llamadas No Exitosas', value: metrics.unsuccessfulCalls || 0 }
      ]);

      // Style header row
      kpisSheet.getRow(1).font = { bold: true };
      kpisSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Age Distribution Sheet
      const ageSheet = workbook.addWorksheet('Distribución por Edad');
      ageSheet.columns = [
        { header: 'Rango de Edad', key: 'name', width: 20 },
        { header: 'Cantidad', key: 'value', width: 15 }
      ];

      if (metrics.ageDistribution && metrics.ageDistribution.length > 0) {
        ageSheet.addRows(metrics.ageDistribution);
      }

      ageSheet.getRow(1).font = { bold: true };
      ageSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Marital Status Sheet
      const maritalSheet = workbook.addWorksheet('Estado Civil');
      maritalSheet.columns = [
        { header: 'Estado Civil', key: 'name', width: 20 },
        { header: 'Cantidad', key: 'value', width: 15 }
      ];

      if (metrics.maritalStatus && metrics.maritalStatus.length > 0) {
        maritalSheet.addRows(metrics.maritalStatus);
      }

      maritalSheet.getRow(1).font = { bold: true };
      maritalSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Occupation Sheet
      const occupationSheet = workbook.addWorksheet('Ocupación');
      occupationSheet.columns = [
        { header: 'Ocupación', key: 'name', width: 30 },
        { header: 'Cantidad', key: 'value', width: 15 }
      ];

      if (metrics.ocupation && metrics.ocupation.length > 0) {
        occupationSheet.addRows(metrics.ocupation);
      }

      occupationSheet.getRow(1).font = { bold: true };
      occupationSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Contact Type Sheet
      const contactSheet = workbook.addWorksheet('Tipo de Contacto');
      contactSheet.columns = [
        { header: 'Tipo', key: 'type', width: 20 },
        { header: 'Cantidad', key: 'count', width: 15 }
      ];

      if (metrics.contactType && metrics.contactType.length > 0) {
        const contact = metrics.contactType[0];
        contactSheet.addRows([
          { type: 'Celular', count: contact.Celular || 0 },
          { type: 'Teléfono', count: contact.Telefono || 0 }
        ]);
      }

      contactSheet.getRow(1).font = { bold: true };
      contactSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Calls Per Month Sheet
      const monthlySheet = workbook.addWorksheet('Llamadas por Mes');
      monthlySheet.columns = [
        { header: 'Mes', key: 'name', width: 15 },
        { header: 'Cantidad', key: 'lineValue', width: 15 }
      ];

      if (metrics.callsPerMonth && metrics.callsPerMonth.length > 0) {
        monthlySheet.addRows(metrics.callsPerMonth);
      }

      monthlySheet.getRow(1).font = { bold: true };
      monthlySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Subscription Results Sheet
      const subscriptionSheet = workbook.addWorksheet('Resultados de Suscripción');
      subscriptionSheet.columns = [
        { header: 'Resultado', key: 'name', width: 20 },
        { header: 'Cantidad', key: 'value', width: 15 }
      ];

      if (metrics.callSubscription && metrics.callSubscription.length > 0) {
        subscriptionSheet.addRows(metrics.callSubscription);
      }

      subscriptionSheet.getRow(1).font = { bold: true };
      subscriptionSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4A9B9B' }
      };

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=dashboard-export.xlsx'
      );

      // Write to response
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      next(error);
    }
  }
}

export default ExportController;
