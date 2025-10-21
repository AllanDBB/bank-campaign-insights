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

      // Filtros Aplicados Section
      const actualFilters = Object.keys(filters).filter(key => key !== 'filterName');
      
      if (filterName || actualFilters.length > 0) {
        doc.fontSize(16).text('Filtros Aplicados', { underline: true });
        doc.moveDown();
        
        if (filterName) {
          doc.fontSize(12).text(`Nombre del Filtro: ${filterName}`, { bold: true });
          doc.moveDown(0.5);
        }

        if (actualFilters.length > 0) {
          doc.fontSize(11);
          const filterLabels = this.getFilterLabels();
          
          Object.entries(filters).forEach(([key, value]) => {
            if (key !== 'filterName' && value !== undefined && value !== null && value !== '') {
              const label = filterLabels[key] || key;
              const displayValue = Array.isArray(value) ? value.join(', ') : value;
              doc.text(`${label}: ${displayValue}`);
            }
          });
        } else if (filterName) {
          doc.fontSize(11).text('Sin filtros específicos aplicados');
        }
        
        doc.moveDown(2);
      }

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

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Bank Campaign Insights';
      workbook.created = new Date();

      // Filtros Aplicados Sheet (si hay filtros)
      const actualFilters = Object.keys(filters).filter(key => key !== 'filterName');
      
      if (filterName || actualFilters.length > 0) {
        const filtersSheet = workbook.addWorksheet('Filtros Aplicados');
        filtersSheet.columns = [
          { header: 'Campo', key: 'field', width: 40 },
          { header: 'Valor', key: 'value', width: 40 }
        ];

        // Agregar nombre del filtro si existe
        if (filterName) {
          filtersSheet.addRow({ field: 'NOMBRE DEL FILTRO', value: filterName });
          filtersSheet.getRow(2).font = { bold: true, color: { argb: 'FF1976D2' } };
          filtersSheet.addRow({ field: '', value: '' }); // Fila en blanco
        }

        if (actualFilters.length > 0) {
          const filterLabels = this.getFilterLabels();
          
          Object.entries(filters).forEach(([key, value]) => {
            if (key !== 'filterName' && value !== undefined && value !== null && value !== '') {
              const label = filterLabels[key] || key;
              const displayValue = Array.isArray(value) ? value.join(', ') : value;
              filtersSheet.addRow({ field: label, value: displayValue });
            }
          });
        } else if (filterName) {
          filtersSheet.addRow({ field: 'Sin filtros específicos aplicados', value: '' });
        }

        // Style header row
        filtersSheet.getRow(1).font = { bold: true };
        filtersSheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFEB3B' }
        };
      }

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

  getFilterLabels() {
    return {
      // Range filters
      'age_min': 'Edad Mínima',
      'age_max': 'Edad Máxima',
      'contactDurationSeconds_min': 'Duración Mínima (seg)',
      'contactDurationSeconds_max': 'Duración Máxima (seg)',
      'numberOfContacts_min': 'Número Mínimo de Contactos',
      'numberOfContacts_max': 'Número Máximo de Contactos',
      'daysSinceLastContact_min': 'Días Mínimos desde Último Contacto',
      'daysSinceLastContact_max': 'Días Máximos desde Último Contacto',
      'previousContactsCount_min': 'Contactos Previos Mínimos',
      'previousContactsCount_max': 'Contactos Previos Máximos',
      'employmentVariationRate_min': 'Tasa de Variación de Empleo Mínima',
      'employmentVariationRate_max': 'Tasa de Variación de Empleo Máxima',
      'consumerPriceIndex_min': 'IPC Mínimo',
      'consumerPriceIndex_max': 'IPC Máximo',
      'consumerConfidenceIndex_min': 'Índice de Confianza del Consumidor Mínimo',
      'consumerConfidenceIndex_max': 'Índice de Confianza del Consumidor Máximo',
      'euriborThreeMonthRate_min': 'Euribor 3M Mínimo',
      'euriborThreeMonthRate_max': 'Euribor 3M Máximo',
      'numberOfEmployees_min': 'Número Mínimo de Empleados',
      'numberOfEmployees_max': 'Número Máximo de Empleados',

      // Multiple choice filters
      'job': 'Profesión',
      'marital': 'Estado Civil',
      'education': 'Educación',
      'hasCreditDefault': 'Tiene Crédito en Default',
      'hasHousingLoan': 'Tiene Préstamo Hipotecario',
      'hasPersonalLoan': 'Tiene Préstamo Personal',
      'contactType': 'Tipo de Contacto',
      'contactMonth': 'Mes de Contacto',
      'contactDayOfWeek': 'Día de la Semana',
      'previousCampaignOutcome': 'Resultado Campaña Anterior',
      'subscribedTermDeposit': 'Suscribió Depósito a Plazo'
    };
  }
}

export default ExportController;
