import BaseProspectTemplate from './BaseProspectTemplate.js';
import { scoreProspect } from '../../../services/predictionService';

class LogisticProspectTemplate extends BaseProspectTemplate {
  normalize(formData) {
    return { ...formData };
  }

  validate(formData) {
    const required = ['age', 'job', 'marital', 'education', 'contactMonth', 'contactDayOfWeek'];
    const missing = required.filter((field) => !formData[field] && formData[field] !== 0);
    if (missing.length) {
      throw new Error(`Faltan campos requeridos: ${missing.join(', ')}`);
    }
  }

  mapToPayload(formData) {
    return {
      ...formData,
      age: Number(formData.age || 0),
      contactDurationSeconds: Number(formData.contactDurationSeconds || 0),
      numberOfContacts: Number(formData.numberOfContacts || 0),
      daysSinceLastContact: Number(formData.daysSinceLastContact || 0),
      previousContactsCount: Number(formData.previousContactsCount || 0),
      employmentVariationRate: Number(formData.employmentVariationRate || 0),
      consumerPriceIndex: Number(formData.consumerPriceIndex || 0),
      consumerConfidenceIndex: Number(formData.consumerConfidenceIndex || 0),
      euriborThreeMonthRate: Number(formData.euriborThreeMonthRate || 0),
      numberOfEmployees: Number(formData.numberOfEmployees || 0)
    };
  }

  async callModel(payload) {
    return scoreProspect(payload);
  }

  formatResponse(response) {
    return response;
  }
}

export default LogisticProspectTemplate;
