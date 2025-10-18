import IDocumentValidator from './IDocumentValidator.js';

class BusinessRulesValidator extends IDocumentValidator {
  constructor() {
    super();
  }

  validate(document) {
    const errors = [];

    if (document.previousContactsCount !== undefined && document.previousContactsCount !== null) {
      if (document.previousContactsCount > 0 && document.previousCampaignOutcome === 'nonexistent') {
        errors.push('Previous contacts count is greater than 0 but previous campaign outcome is nonexistent');
      }
    }

    if (document.daysSinceLastContact !== undefined && document.daysSinceLastContact !== null) {
      if (document.daysSinceLastContact === 999 && document.previousContactsCount > 0) {
        errors.push('Days since last contact is 999 (never contacted) but previous contacts count is greater than 0');
      }
    }

    if (document.contactDurationSeconds !== undefined && document.contactDurationSeconds !== null) {
      if (document.contactDurationSeconds === 0 && document.subscribedTermDeposit === 'yes') {
        errors.push('Contact duration is 0 but client subscribed to term deposit');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default BusinessRulesValidator;
