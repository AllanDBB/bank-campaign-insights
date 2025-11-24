class JustificationService {
  constructor(maxReasons = 3) {
    this.maxReasons = maxReasons;
  }

  buildJustification(contributions, probability) {
    if (!Array.isArray(contributions)) return [];

    const sorted = [...contributions]
      .filter(c => c.feature !== 'intercept')
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

    const top = sorted.slice(0, this.maxReasons);

    return top.map(item => {
      const direction = item.contribution >= 0 ? 'incrementa' : 'disminuye';
      return `${this.humanizeFeature(item.label)} (${item.value}) ${direction} la probabilidad debido a su peso ${item.weight.toFixed(3)}`;
    });
  }

  humanizeFeature(key) {
    const mapping = {
      age: 'Edad',
      job: 'Profesión',
      marital: 'Estado civil',
      education: 'Nivel educativo',
      hasCreditDefault: 'Historial de mora',
      hasHousingLoan: 'Hipoteca',
      hasPersonalLoan: 'Préstamo personal',
      contactType: 'Canal de contacto',
      contactMonth: 'Mes de contacto',
      contactDayOfWeek: 'Día de contacto',
      contactDurationSeconds: 'Duración de contacto (seg)',
      numberOfContacts: 'Número de contactos',
      daysSinceLastContact: 'Días desde último contacto',
      previousContactsCount: 'Contactos previos',
      previousCampaignOutcome: 'Resultado campaña anterior',
      employmentVariationRate: 'Variación de empleo',
      consumerPriceIndex: 'Índice de precios al consumidor',
      consumerConfidenceIndex: 'Confianza del consumidor',
      euriborThreeMonthRate: 'Euribor 3M',
      numberOfEmployees: 'Número de empleados'
    };

    return mapping[key] || key;
  }
}

export default JustificationService;
