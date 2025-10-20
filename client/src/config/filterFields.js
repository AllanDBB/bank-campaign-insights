export const FILTER_FIELDS = {
  age: {
    label: "Edad",
    type: "range",
    dbField: "age"
  },
  job: {
    label: "Profesión",
    type: "multiple",
    dbField: "job",
    options: [
      "admin.",
      "blue-collar",
      "entrepreneur",
      "housemaid",
      "management",
      "retired",
      "self-employed",
      "services",
      "student",
      "technician",
      "unemployed",
      "unknown"
    ]
  },
  marital: {
    label: "Estado Civil",
    type: "multiple",
    dbField: "marital",
    options: ["divorced", "married", "single", "unknown"]
  },
  education: {
    label: "Educación",
    type: "multiple",
    dbField: "education",
    options: [
      "basic.4y",
      "basic.6y",
      "basic.9y",
      "high.school",
      "illiterate",
      "professional.course",
      "university.degree",
      "unknown"
    ]
  },
  hasCreditDefault: {
    label: "Tiene Crédito en Default",
    type: "multiple",
    dbField: "hasCreditDefault",
    options: ["yes", "no", "unknown"]
  },
  hasHousingLoan: {
    label: "Tiene Préstamo Hipotecario",
    type: "multiple",
    dbField: "hasHousingLoan",
    options: ["yes", "no", "unknown"]
  },
  hasPersonalLoan: {
    label: "Tiene Préstamo Personal",
    type: "multiple",
    dbField: "hasPersonalLoan",
    options: ["yes", "no", "unknown"]
  },
  contactType: {
    label: "Tipo de Contacto",
    type: "multiple",
    dbField: "contactType",
    options: ["cellular", "telephone"]
  },
  contactMonth: {
    label: "Mes de Contacto",
    type: "multiple",
    dbField: "contactMonth",
    options: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
  },
  contactDayOfWeek: {
    label: "Día de la Semana",
    type: "multiple",
    dbField: "contactDayOfWeek",
    options: ["mon", "tue", "wed", "thu", "fri"]
  },
  contactDurationSeconds: {
    label: "Duración del Contacto (seg)",
    type: "range",
    dbField: "contactDurationSeconds"
  },
  numberOfContacts: {
    label: "Número de Contactos",
    type: "range",
    dbField: "numberOfContacts"
  },
  daysSinceLastContact: {
    label: "Días desde Último Contacto",
    type: "range",
    dbField: "daysSinceLastContact"
  },
  previousContactsCount: {
    label: "Contactos Previos",
    type: "range",
    dbField: "previousContactsCount"
  },
  previousCampaignOutcome: {
    label: "Resultado Campaña Anterior",
    type: "multiple",
    dbField: "previousCampaignOutcome",
    options: ["failure", "nonexistent", "success"]
  },
  employmentVariationRate: {
    label: "Tasa de Variación de Empleo",
    type: "range",
    dbField: "employmentVariationRate"
  },
  consumerPriceIndex: {
    label: "Índice de Precios al Consumidor",
    type: "range",
    dbField: "consumerPriceIndex"
  },
  consumerConfidenceIndex: {
    label: "Índice de Confianza del Consumidor",
    type: "range",
    dbField: "consumerConfidenceIndex"
  },
  euriborThreeMonthRate: {
    label: "Tasa Euribor 3 Meses",
    type: "range",
    dbField: "euriborThreeMonthRate"
  },
  numberOfEmployees: {
    label: "Número de Empleados",
    type: "range",
    dbField: "numberOfEmployees"
  },
  subscribedTermDeposit: {
    label: "Suscribió Depósito a Plazo",
    type: "multiple",
    dbField: "subscribedTermDeposit",
    options: ["yes", "no"]
  }
};

export const getFieldsByType = (type) => {
  return Object.entries(FILTER_FIELDS)
    .filter(([_, config]) => config.type === type)
    .map(([key, config]) => ({ key, ...config }));
};

export const getAllFields = () => {
  return Object.entries(FILTER_FIELDS)
    .map(([key, config]) => ({ key, ...config }));
};
