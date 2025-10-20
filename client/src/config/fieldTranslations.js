export const FIELD_TRANSLATIONS = {
  // Client Information
  age: "Edad",
  job: "Profesión",
  marital: "Estado Civil",
  education: "Educación",

  // Client Credit Information
  hasCreditDefault: "Tiene Crédito en Default",
  hasHousingLoan: "Tiene Préstamo Hipotecario",
  hasPersonalLoan: "Tiene Préstamo Personal",

  // Campaign Contact Information
  contactType: "Tipo de Contacto",
  contactMonth: "Mes de Contacto",
  contactDayOfWeek: "Día de la Semana",
  contactDurationSeconds: "Duración del Contacto (seg)",
  numberOfContacts: "Número de Contactos",
  daysSinceLastContact: "Días desde Último Contacto",
  previousContactsCount: "Contactos Previos",
  previousCampaignOutcome: "Resultado Campaña Anterior",

  // Economic Indicators
  employmentVariationRate: "Tasa de Variación de Empleo",
  consumerPriceIndex: "Índice de Precios al Consumidor",
  consumerConfidenceIndex: "Índice de Confianza del Consumidor",
  euriborThreeMonthRate: "Tasa Euribor 3 Meses",
  numberOfEmployees: "Número de Empleados",

  // Campaign Result
  subscribedTermDeposit: "Suscribió Depósito a Plazo"
};

export const translateField = (fieldName) => {
  return FIELD_TRANSLATIONS[fieldName] || fieldName;
};

export const getTranslatedFields = (fields) => {
  return Object.entries(fields).map(([key, config]) => ({
    key,
    label: translateField(key),
    ...config
  }));
};
