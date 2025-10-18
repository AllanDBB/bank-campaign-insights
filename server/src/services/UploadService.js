import csv from 'csv-parser';
import { Readable } from 'stream';
import StructureValidator from '../utils/validators/StructureValidator.js';
import DataQualityValidator from '../utils/validators/DataQualityValidator.js';
import BusinessRulesValidator from '../utils/validators/BusinessRulesValidator.js';
import DocumentDAO from '../daos/DocumentDAO.js';

class UploadService {
  constructor() {
    this.structureValidator = new StructureValidator();
    this.dataQualityValidator = new DataQualityValidator();
    this.businessRulesValidator = new BusinessRulesValidator();
    this.documentDAO = new DocumentDAO();
    this.batchSize = 1000;

    this.fieldMapping = {
      'age': 'age',
      'job': 'job',
      'marital': 'marital',
      'education': 'education',
      'default': 'hasCreditDefault',
      'housing': 'hasHousingLoan',
      'loan': 'hasPersonalLoan',
      'contact': 'contactType',
      'month': 'contactMonth',
      'day_of_week': 'contactDayOfWeek',
      'duration': 'contactDurationSeconds',
      'campaign': 'numberOfContacts',
      'pdays': 'daysSinceLastContact',
      'previous': 'previousContactsCount',
      'poutcome': 'previousCampaignOutcome',
      'emp.var.rate': 'employmentVariationRate',
      'cons.price.idx': 'consumerPriceIndex',
      'cons.conf.idx': 'consumerConfidenceIndex',
      'euribor3m': 'euriborThreeMonthRate',
      'nr.employed': 'numberOfEmployees',
      'y': 'subscribedTermDeposit'
    };

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
  }

  normalizeFieldNames(csvRecord) {
    const normalizedRecord = {};

    for (const csvFieldName in csvRecord) {
      const dbFieldName = this.fieldMapping[csvFieldName];
      if (dbFieldName) {
        normalizedRecord[dbFieldName] = csvRecord[csvFieldName];
      } else {
        normalizedRecord[csvFieldName] = csvRecord[csvFieldName];
      }
    }

    return normalizedRecord;
  }

  transformTypes(record) {
    const transformedRecord = { ...record };

    for (const field of this.numericFields) {
      if (transformedRecord[field] !== undefined && transformedRecord[field] !== null && transformedRecord[field] !== '') {
        const value = transformedRecord[field];

        if (typeof value === 'string') {
          const numericValue = parseFloat(value);
          if (!isNaN(numericValue)) {
            transformedRecord[field] = numericValue;
          }
        }
      }
    }

    return transformedRecord;
  }

  validateDocument(document) {
    const allErrors = [];

    const structureValidation = this.structureValidator.validate(document);
    if (!structureValidation.isValid) {
      allErrors.push(...structureValidation.errors);
    }

    const qualityValidation = this.dataQualityValidator.validate(document);
    if (!qualityValidation.isValid) {
      allErrors.push(...qualityValidation.errors);
    }

    const businessValidation = this.businessRulesValidator.validate(document);
    if (!businessValidation.isValid) {
      allErrors.push(...businessValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  async parseCSV(fileBuffer) {
    return new Promise((resolve, reject) => {
      const records = [];
      const errors = [];
      let rowNumber = 0;

      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          rowNumber++;

          const normalizedRecord = this.normalizeFieldNames(data);
          const transformedRecord = this.transformTypes(normalizedRecord);
          const validationResult = this.validateDocument(transformedRecord);

          if (validationResult.isValid) {
            records.push(transformedRecord);
          } else {
            errors.push({
              row: rowNumber,
              errors: validationResult.errors
            });
          }
        })
        .on('end', () => {
          console.log(`CSV parsing completed. Total records parsed: ${records.length}`);
          if (errors.length > 0) {
            console.log(`Validation errors found in ${errors.length} records`);
          }
          resolve({ records, errors });
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    });
  }

  async batchInsert(records) {
    const batches = [];
    let successfulInserts = 0;
    let failedInserts = 0;
    const batchErrors = [];

    for (let i = 0; i < records.length; i += this.batchSize) {
      batches.push(records.slice(i, i + this.batchSize));
    }

    console.log(`Processing ${batches.length} batches of up to ${this.batchSize} records each`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Inserting batch ${i + 1}/${batches.length} with ${batch.length} records`);

      const result = await this.documentDAO.insertBatch(batch);

      if (result.success) {
        successfulInserts += result.insertedCount;
        if (result.errors && result.errors.length > 0) {
          failedInserts += result.errors.length;
          batchErrors.push(...result.errors);
        }
      } else {
        failedInserts += batch.length;
        batchErrors.push({
          batch: i + 1,
          error: result.message
        });
      }
    }

    return {
      successfulInserts,
      failedInserts,
      errors: batchErrors
    };
  }

  async processUpload(fileBuffer) {
    console.log('Starting document upload process');
    console.log(`File size: ${fileBuffer.length} bytes`);

    const parseResult = await this.parseCSV(fileBuffer);

    const totalRecords = parseResult.records.length + parseResult.errors.length;
    console.log(`Total records in CSV: ${totalRecords}`);
    console.log(`Valid records to insert: ${parseResult.records.length}`);
    console.log(`Invalid records (validation failed): ${parseResult.errors.length}`);

    if (parseResult.records.length === 0) {
      return {
        totalRecords: totalRecords,
        successfulInserts: 0,
        failedInserts: totalRecords,
        validationErrors: parseResult.errors,
        insertErrors: []
      };
    }

    const insertResult = await this.batchInsert(parseResult.records);

    console.log(`Upload process completed`);
    console.log(`Successfully inserted: ${insertResult.successfulInserts} records`);
    console.log(`Failed to insert: ${insertResult.failedInserts} records`);

    return {
      totalRecords: totalRecords,
      successfulInserts: insertResult.successfulInserts,
      failedInserts: parseResult.errors.length + insertResult.failedInserts,
      validationErrors: parseResult.errors,
      insertErrors: insertResult.errors
    };
  }
}

export default UploadService;
