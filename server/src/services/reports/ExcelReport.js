import ExcelJS from 'exceljs';
import BaseReport from './BaseReport.js';

/**
 * Concrete implementation for Excel reports
 */
class ExcelReport extends BaseReport {
  constructor(metrics, filters, filterName) {
    super(metrics, filters, filterName);
  }

  /**
   * Generate Excel report
   */
  async generate(res) {
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Bank Campaign Insights';
    workbook.created = new Date();

    // Add filters sheet if applicable
    if (this.hasFilters()) {
      this.addFiltersSheet(workbook);
    }

    // Add content sheets
    this.addKPIsSheet(workbook);
    this.addContactTypeSheet(workbook);
    this.addAgeDistributionSheet(workbook);
    this.addMaritalStatusSheet(workbook);
    this.addOccupationSheet(workbook);
    this.addCallsPerMonthSheet(workbook);
    this.addSubscriptionSheet(workbook);

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=dashboard-export.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  }

  /**
   * Add filters sheet
   */
  addFiltersSheet(workbook) {
    const actualFilters = this.getActualFilters();
    const filtersSheet = workbook.addWorksheet('Filtros Aplicados');
    
    filtersSheet.columns = [
      { header: 'Campo', key: 'field', width: 40 },
      { header: 'Valor', key: 'value', width: 40 }
    ];

    // Add filter name if exists
    if (this.filterName) {
      filtersSheet.addRow({ field: 'NOMBRE DEL FILTRO', value: this.filterName });
      filtersSheet.getRow(2).font = { bold: true, color: { argb: 'FF1976D2' } };
      filtersSheet.addRow({ field: '', value: '' }); // Blank row
    }

    if (actualFilters.length > 0) {
      const filterLabels = this.getFilterLabels();

      Object.entries(this.filters).forEach(([key, value]) => {
        if (key !== 'filterName' && value !== undefined && value !== null && value !== '') {
          const label = filterLabels[key] || key;
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          filtersSheet.addRow({ field: label, value: displayValue });
        }
      });
    } else if (this.filterName) {
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

  /**
   * Add KPIs sheet
   */
  addKPIsSheet(workbook) {
    const kpisSheet = workbook.addWorksheet('KPIs Principales');
    kpisSheet.columns = [
      { header: 'Métrica', key: 'metric', width: 40 },
      { header: 'Valor', key: 'value', width: 20 }
    ];

    kpisSheet.addRows([
      { metric: 'Tasa de Conversión (%)', value: this.metrics.cr?.toFixed(2) || 0 },
      { metric: 'Total de Contactos', value: this.metrics.totalCalls || 0 },
      { metric: 'Duración Media de Llamadas (seg)', value: this.metrics.callAvg || 0 },
      { metric: 'Llamadas Exitosas', value: this.metrics.successfulCalls || 0 },
      { metric: 'Llamadas No Exitosas', value: this.metrics.unsuccessfulCalls || 0 }
    ]);

    this.styleHeaderRow(kpisSheet);
  }

  /**
   * Add contact type sheet
   */
  addContactTypeSheet(workbook) {
    const contactSheet = workbook.addWorksheet('Tipo de Contacto');
    contactSheet.columns = [
      { header: 'Tipo', key: 'type', width: 20 },
      { header: 'Cantidad', key: 'count', width: 15 }
    ];

    if (this.metrics.contactType && this.metrics.contactType.length > 0) {
      const contact = this.metrics.contactType[0];
      contactSheet.addRows([
        { type: 'Celular', count: contact.Celular || 0 },
        { type: 'Teléfono', count: contact.Telefono || 0 }
      ]);
    }

    this.styleHeaderRow(contactSheet);
  }

  /**
   * Add age distribution sheet
   */
  addAgeDistributionSheet(workbook) {
    const ageSheet = workbook.addWorksheet('Distribución por Edad');
    ageSheet.columns = [
      { header: 'Rango de Edad', key: 'name', width: 20 },
      { header: 'Cantidad', key: 'value', width: 15 }
    ];

    if (this.metrics.ageDistribution && this.metrics.ageDistribution.length > 0) {
      this.metrics.ageDistribution.forEach(item => {
        ageSheet.addRow({ name: item.name, value: item.value });
      });
    }

    this.styleHeaderRow(ageSheet);
  }

  /**
   * Add marital status sheet
   */
  addMaritalStatusSheet(workbook) {
    const maritalSheet = workbook.addWorksheet('Estado Civil');
    maritalSheet.columns = [
      { header: 'Estado Civil', key: 'name', width: 20 },
      { header: 'Cantidad', key: 'value', width: 15 }
    ];

    if (this.metrics.maritalStatus && this.metrics.maritalStatus.length > 0) {
      this.metrics.maritalStatus.forEach(item => {
        maritalSheet.addRow({ name: item.name, value: item.value });
      });
    }

    this.styleHeaderRow(maritalSheet);
  }

  /**
   * Add occupation sheet
   */
  addOccupationSheet(workbook) {
    const occupationSheet = workbook.addWorksheet('Ocupación');
    occupationSheet.columns = [
      { header: 'Ocupación', key: 'name', width: 30 },
      { header: 'Cantidad', key: 'value', width: 15 }
    ];

    if (this.metrics.ocupation && this.metrics.ocupation.length > 0) {
      this.metrics.ocupation.forEach(item => {
        occupationSheet.addRow({ name: item.name, value: item.value });
      });
    }

    this.styleHeaderRow(occupationSheet);
  }

  /**
   * Add calls per month sheet
   */
  addCallsPerMonthSheet(workbook) {
    const monthlySheet = workbook.addWorksheet('Llamadas por Mes');
    monthlySheet.columns = [
      { header: 'Mes', key: 'name', width: 15 },
      { header: 'Cantidad', key: 'lineValue', width: 15 }
    ];

    if (this.metrics.callsPerMonth && this.metrics.callsPerMonth.length > 0) {
      this.metrics.callsPerMonth.forEach(item => {
        monthlySheet.addRow({ name: item.name, lineValue: item.lineValue });
      });
    }

    this.styleHeaderRow(monthlySheet);
  }

  /**
   * Add subscription sheet
   */
  addSubscriptionSheet(workbook) {
    const subscriptionSheet = workbook.addWorksheet('Resultados Suscripción');
    subscriptionSheet.columns = [
      { header: 'Resultado', key: 'name', width: 20 },
      { header: 'Cantidad', key: 'value', width: 15 }
    ];

    if (this.metrics.callSubscription && this.metrics.callSubscription.length > 0) {
      this.metrics.callSubscription.forEach(item => {
        subscriptionSheet.addRow({ name: item.name, value: item.value });
      });
    }

    this.styleHeaderRow(subscriptionSheet);
  }

  /**
   * Style header row for a worksheet
   */
  styleHeaderRow(sheet) {
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A9B9B' }
    };
  }
}

export default ExcelReport;
