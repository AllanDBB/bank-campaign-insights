import Document from '../models/Document.js';

class DocumentDAO {
  async getDocuments(userId, filters = {}, pagination = {}) {
    try {
      const query = { userId };
      const { page = 1, limit = 50, sortBy = 'createdAt', order = 'desc' } = pagination;

      // Range filters (age, contactDurationSeconds, numberOfContacts, etc.)
      const rangeFields = [
        'age', 'contactDurationSeconds', 'numberOfContacts',
        'daysSinceLastContact', 'previousContactsCount',
        'employmentVariationRate', 'consumerPriceIndex',
        'consumerConfidenceIndex', 'euriborThreeMonthRate', 'numberOfEmployees'
      ];

      rangeFields.forEach(field => {
        const minKey = `${field}_min`;
        const maxKey = `${field}_max`;

        if (filters[minKey] !== undefined || filters[maxKey] !== undefined) {
          query[field] = {};
          if (filters[minKey] !== undefined) query[field].$gte = Number(filters[minKey]);
          if (filters[maxKey] !== undefined) query[field].$lte = Number(filters[maxKey]);
        }
      });

      // Multiple choice filters (job, marital, education, etc.)
      const multipleFields = [
        'job', 'marital', 'education', 'hasCreditDefault',
        'hasHousingLoan', 'hasPersonalLoan', 'contactType',
        'contactMonth', 'contactDayOfWeek', 'previousCampaignOutcome',
        'subscribedTermDeposit'
      ];

      multipleFields.forEach(field => {
        if (filters[field]) {
          const values = Array.isArray(filters[field])
            ? filters[field]
            : filters[field].split(',');
          query[field] = { $in: values };
        }
      });

      const skip = (page - 1) * limit;
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortOptions = { [sortBy]: sortOrder };

      const [documents, totalCount] = await Promise.all([
        Document.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Document.countDocuments(query)
      ]);

      return {
        success: true,
        documents,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async insertBatch(documents) {
    try {
      const result = await Document.insertMany(documents, {
        ordered: false
      });

      return {
        success: true,
        insertedCount: result.length,
        documents: result
      };
    } catch (error) {
      const insertedCount = error.insertedDocs ? error.insertedDocs.length : 0;
      const validationErrors = [];

      if (error.writeErrors) {
        error.writeErrors.forEach(writeError => {
          validationErrors.push({
            index: writeError.index,
            error: writeError.errmsg
          });
        });
      }

      return {
        success: insertedCount > 0,
        insertedCount: insertedCount,
        errors: validationErrors,
        message: error.message
      };
    }
  }

  async deleteByUserId(userId) {
    try {
      const result = await Document.deleteMany({ userId });
      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async countAll() {
    try {
      const count = await Document.countDocuments();
      return {
        success: true,
        count: count
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default DocumentDAO;
