import DocumentDAO from '../daos/DocumentDAO.js';
import SchemaService from '../services/SchemaService.js';

class DocumentController {
  constructor() {
    this.documentDAO = new DocumentDAO();
    this.schemaService = new SchemaService();
  }

  async getDocuments(req, res, next) {
    try {
      const { page, limit, sortBy, order, ...filters } = req.query;

      const pagination = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 100,
        sortBy: sortBy || 'createdAt',
        order: order || 'desc'
      };

      const result = await this.documentDAO.getDocuments(
        req.user.id,
        filters,
        pagination
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.documents,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error in getDocuments:', error);
      next(error);
    }
  }

  async getDocumentSchema(req, res, next) {
    try {
      const result = await this.schemaService.getDocumentSchema(req.user.id);

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

export default DocumentController;
