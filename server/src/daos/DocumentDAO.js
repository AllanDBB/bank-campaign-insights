import Document from '../models/Document.js';

class DocumentDAO {
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
