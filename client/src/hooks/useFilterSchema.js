import { useState, useEffect } from 'react';
import schemaService from '../services/schemaService';
import { getTranslatedFields } from '../config/fieldTranslations';

export const useFilterSchema = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSchema();
  }, []);

  const loadSchema = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await schemaService.getDocumentSchema();

      if (response.success && response.data) {
        const translatedFields = getTranslatedFields(response.data);
        setFields(translatedFields);
      } else {
        throw new Error('Failed to load schema');
      }
    } catch (err) {
      console.error('Error loading schema:', err);
      setError(err.message);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const getFieldByKey = (key) => {
    return fields.find(field => field.key === key);
  };

  const getFieldsByType = (type) => {
    return fields.filter(field => field.type === type);
  };

  return {
    fields,
    loading,
    error,
    getFieldByKey,
    getFieldsByType,
    reload: loadSchema
  };
};
