import Document from '../models/Document.js';

class SchemaService {
  async getDocumentSchema(userId) {
    try {
      const schema = Document.schema.obj;
      const fields = {};

      for (const [fieldName, fieldConfig] of Object.entries(schema)) {
        if (fieldName === 'userId' || fieldName === '_id') continue;

        const fieldType = this.determineFieldType(fieldConfig);
        const uniqueValues = await this.getUniqueValues(userId, fieldName, fieldType);

        fields[fieldName] = {
          dbField: fieldName,
          type: fieldType,
          mongoType: fieldConfig.type?.name || 'Mixed',
          options: uniqueValues
        };
      }

      return {
        success: true,
        fields
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  determineFieldType(fieldConfig) {
    const mongoType = fieldConfig.type?.name;

    if (mongoType === 'Number') {
      return 'range';
    }

    if (mongoType === 'String') {
      return 'multiple';
    }

    return 'multiple';
  }

  async getUniqueValues(userId, fieldName, fieldType) {
    try {
      if (fieldType === 'range') {
        return null;
      }

      const uniqueValues = await Document.distinct(fieldName, { userId });

      return uniqueValues
        .filter(val => val !== null && val !== undefined && val !== '')
        .sort();
    } catch (error) {
      console.error(`Error getting unique values for ${fieldName}:`, error);
      return [];
    }
  }
}

export default SchemaService;
