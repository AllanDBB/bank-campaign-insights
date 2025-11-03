/**
 * Abstract base class for all report types
 */
class BaseReport {
  constructor(metrics, filters, filterName) {
    if (new.target === BaseReport) {
      throw new TypeError('Cannot construct BaseReport instances directly');
    }
    this.metrics = metrics;
    this.filters = filters;
    this.filterName = filterName;
  }

  /**
   * Abstract method to generate the report
   * Must be implemented by subclasses
   */
  async generate(res) {
    throw new Error('Method generate() must be implemented');
  }

  /**
   * Get filter labels in Spanish
   */
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

  /**
   * Get actual filters excluding filterName
   */
  getActualFilters() {
    return Object.keys(this.filters).filter(key => key !== 'filterName');
  }

  /**
   * Check if there are filters to display
   */
  hasFilters() {
    return this.filterName || this.getActualFilters().length > 0;
  }
}

export default BaseReport;
