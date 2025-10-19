import csv from 'csv-parser';
import { Readable } from 'stream';
import StructureValidator from '../utils/validators/StructureValidator.js';
import DataQualityValidator from '../utils/validators/DataQualityValidator.js';
import BusinessRulesValidator from '../utils/validators/BusinessRulesValidator.js';
import DocumentDAO from '../daos/DocumentDAO.js';

class UploadService {
  constructor() {
    this.validators = [];
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

    this.addValidator(new StructureValidator());
    this.addValidator(new DataQualityValidator());
    this.addValidator(new BusinessRulesValidator());
  }

  addValidator(validator) {
    this.validators.push(validator);
  }

  async normalizeData(fileBuffer) {
    return new Promise((resolve, reject) => {
      const records = [];
      const errors = [];
      let rowNumber = 0;

      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csv({ separator: ';' }))
        .on('data', (csvRecord) => {
          rowNumber++;

          const normalizedRecord = {};

          for (const csvFieldName in csvRecord) {
            const dbFieldName = this.fieldMapping[csvFieldName];
            if (dbFieldName) {
              normalizedRecord[dbFieldName] = csvRecord[csvFieldName];
            } else {
              normalizedRecord[csvFieldName] = csvRecord[csvFieldName];
            }
          }

          for (const field of this.numericFields) {
            if (normalizedRecord[field] !== undefined && normalizedRecord[field] !== null && normalizedRecord[field] !== '') {
              const value = normalizedRecord[field];

              if (typeof value === 'string') {
                const numericValue = parseFloat(value);
                if (!isNaN(numericValue)) {
                  normalizedRecord[field] = numericValue;
                }
              }
            }
          }

          const allErrors = [];
          for (const validator of this.validators) {
            const validationResult = validator.validate(normalizedRecord);
            if (!validationResult.isValid) {
              allErrors.push(...validationResult.errors);
            }
          }

          if (allErrors.length === 0) {
            records.push(normalizedRecord);
          } else {
            errors.push({
              row: rowNumber,
              errors: allErrors
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

  async record(records, userId) {
    const batches = [];
    let successfulInserts = 0;
    let failedInserts = 0;
    const batchErrors = [];

    // Deleting all existing records for this user before inserting new ones
    await this.documentDAO.deleteByUserId(userId);

    // Add userId to each record
    const recordsWithUserId = records.map(record => ({
      ...record,
      userId
    }));

    for (let i = 0; i < recordsWithUserId.length; i += this.batchSize) {
      batches.push(recordsWithUserId.slice(i, i + this.batchSize));
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

  async validateFile(fileBuffer, userId) {
    console.log('Starting document upload process');
    console.log(`File size: ${fileBuffer.length} bytes`);

    const parseResult = await this.normalizeData(fileBuffer);

    const totalRecords = parseResult.records.length + parseResult.errors.length;
    console.log(`Total records in CSV: ${totalRecords}`);
    console.log(`Valid records to insert: ${parseResult.records.length}`);
    console.log(`Invalid records (validation failed): ${parseResult.errors.length}`);

    if (parseResult.records.length === 0) {
      return {
        totalRecords: totalRecords,
        successfulInserts: 0,
        failedInserts: totalRecords,
        successPercentage: 0,
        validationErrors: parseResult.errors,
        insertErrors: []
      };
    }

    const insertResult = await this.record(parseResult.records, userId);

    const successfulInserts = insertResult.successfulInserts;
    const failedInserts = parseResult.errors.length + insertResult.failedInserts;
    const successPercentage = ((successfulInserts / totalRecords) * 100).toFixed(2);

    console.log(`Upload process completed`);
    console.log(`Successfully inserted: ${successfulInserts} records (${successPercentage}%)`);
    console.log(`Failed to insert: ${failedInserts} records`);

    return {
      totalRecords: totalRecords,
      successfulInserts: successfulInserts,
      failedInserts: failedInserts,
      successPercentage: parseFloat(successPercentage),
      validationErrors: parseResult.errors,
      insertErrors: insertResult.errors
    };
  }
}

export default UploadService;
