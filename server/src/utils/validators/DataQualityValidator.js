import IDocumentValidator from './IDocumentValidator.js';

class DataQualityValidator extends IDocumentValidator {
  constructor() {
    super();
  }

  validate(document) {
    const errors = [];

    if (document.age !== undefined && document.age !== null) {
      if (document.age <= 0 || document.age > 120) {
        errors.push(`Age must be between 1 and 120, got: ${document.age}`);
      }
    }

    if (document.contactDurationSeconds !== undefined && document.contactDurationSeconds !== null) {
      if (document.contactDurationSeconds < 0) {
        errors.push(`Contact duration cannot be negative, got: ${document.contactDurationSeconds}`);
      }
    }

    if (document.numberOfContacts !== undefined && document.numberOfContacts !== null) {
      if (document.numberOfContacts <= 0) {
        errors.push(`Number of contacts must be positive, got: ${document.numberOfContacts}`);
      }
    }

    if (document.daysSinceLastContact !== undefined && document.daysSinceLastContact !== null) {
      if (document.daysSinceLastContact < 0) {
        errors.push(`Days since last contact cannot be negative, got: ${document.daysSinceLastContact}`);
      }
    }

    if (document.previousContactsCount !== undefined && document.previousContactsCount !== null) {
      if (document.previousContactsCount < 0) {
        errors.push(`Previous contacts count cannot be negative, got: ${document.previousContactsCount}`);
      }
    }

    const requiredStringFields = ['job', 'marital', 'education', 'contactMonth', 'contactDayOfWeek', 'subscribedTermDeposit'];
    for (const field of requiredStringFields) {
      if (document[field] !== undefined && document[field] !== null) {
        if (typeof document[field] === 'string' && document[field].trim() === '') {
          errors.push(`Required field ${field} cannot be empty`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export default DataQualityValidator;
