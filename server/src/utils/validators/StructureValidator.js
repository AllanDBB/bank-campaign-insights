import IDocumentValidator from './IDocumentValidator.js';

class StructureValidator extends IDocumentValidator {
  constructor() {
    super();

    this.requiredFields = [
      'age',
      'job',
      'marital',
      'education',
      'contactMonth',
      'contactDayOfWeek',
      'subscribedTermDeposit'
    ];

    this.numericFields = [
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

    this.stringFields = [
      'job',
      'marital',
      'education',
      'hasCreditDefault',
      'hasHousingLoan',
      'hasPersonalLoan',
      'contactType',
      'contactMonth',
      'contactDayOfWeek',
      'previousCampaignOutcome',
      'subscribedTermDeposit'
    ];
  }

  validate(document) {
    const errors = [];

    for (const field of this.requiredFields) {
      if (document[field] === undefined || document[field] === null || document[field] === '') {
        errors.push(`Missing required field: ${field}`);
      }
    }

    for (const field of this.numericFields) {
      if (document[field] !== undefined && document[field] !== null && document[field] !== '') {
        if (typeof document[field] !== 'number' || isNaN(document[field])) {
          errors.push(`Field ${field} must be a valid number`);
        }
      }
    }

    for (const field of this.stringFields) {
      if (document[field] !== undefined && document[field] !== null && document[field] !== '') {
        if (typeof document[field] !== 'string') {
          errors.push(`Field ${field} must be a string`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default StructureValidator;
