import SchemaService from '../services/SchemaService.js';

class SchemaController {
  constructor() {
    this.schemaService = new SchemaService();
  }

  async getDocumentSchema(req, res, next) {
    try {
      const result = await this.schemaService.getDocumentSchema(req.userId);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.fields
      });
    } catch (error) {
      console.error('Error in getDocumentSchema:', error);
      next(error);
    }
  }
}

export default SchemaController;
