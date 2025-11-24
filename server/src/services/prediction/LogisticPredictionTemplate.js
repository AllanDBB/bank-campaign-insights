import PredictionTemplate from './PredictionTemplate.js';

class LogisticPredictionTemplate extends PredictionTemplate {
  constructor(strategy, interpreter, recommender, justificationService) {
    super(strategy, interpreter, recommender, justificationService);
  }

  validate(payload) {
    const requiredFields = ['age', 'job', 'marital', 'education', 'contactMonth', 'contactDayOfWeek'];
    const missing = requiredFields.filter(field => payload[field] === undefined || payload[field] === null || payload[field] === '');
    if (missing.length) {
      throw new Error(`Campos obligatorios faltantes: ${missing.join(', ')}`);
    }
    return payload;
  }

  preprocess(payload) {
    const numericFields = [
      'age',
      'contactDurationSeconds',
      'numberOfContacts',
      'daysSinceLastContact',
      'previousContactsCount',
      'employmentVariationRate',
      'consumerPriceIndex',
      'consumerConfidenceIndex',
      'euriborThreeMonthRate',
      'numberOfEmployees'
    ];

    const sanitized = { ...payload };
    numericFields.forEach(field => {
      sanitized[field] = Number(payload[field] ?? 0);
    });

    return sanitized;
  }

  formatResponse(result) {
    return {
      probability: result.probability,
      interpretation: result.interpretation,
      recommendation: result.recommendation,
      justification: result.justification,
      contributions: result.contributions
    };
  }
}

export default LogisticPredictionTemplate;
