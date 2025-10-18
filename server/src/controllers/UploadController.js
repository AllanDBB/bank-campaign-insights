import UploadService from '../services/UploadService.js';
import DocumentDAO from '../daos/DocumentDAO.js';

class UploadController {
  constructor() {
    this.uploadService = new UploadService();
    this.documentDAO = new DocumentDAO();
  }

  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please provide a CSV file.'
        });
      }

      const file = req.file;
      console.log(`Received file upload: ${file.originalname}, size: ${file.size} bytes`);

      const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
      const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

      if (!allowedMimeTypes.includes(file.mimetype) && fileExtension !== '.csv') {
        return res.status(400).json({
          success: false,
          message: 'Invalid file format. Only CSV files are allowed.'
        });
      }

      const result = await this.uploadService.processUpload(file.buffer);

      const response = {
        success: true,
        message: 'Upload completed successfully',
        data: {
          totalRecords: result.totalRecords,
          successfulInserts: result.successfulInserts,
          failedInserts: result.failedInserts
        }
      };

      if (result.validationErrors.length > 0) {
        response.data.validationErrors = result.validationErrors.slice(0, 10);
        response.data.validationErrorCount = result.validationErrors.length;
      }

      if (result.insertErrors.length > 0) {
        response.data.insertErrors = result.insertErrors.slice(0, 10);
        response.data.insertErrorCount = result.insertErrors.length;
      }

      return res.status(200).json(response);

    } catch (error) {
      console.error('Error in uploadDocument:', error);
      next(error);
    }
  }

  async deleteAllDocuments(req, res, next) {
    try {
      console.log('Deleting all documents from database');

      const result = await this.documentDAO.deleteAll();

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: `Successfully deleted ${result.deletedCount} documents`,
          data: {
            deletedCount: result.deletedCount
          }
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete documents',
          error: result.error
        });
      }

    } catch (error) {
      console.error('Error in deleteAllDocuments:', error);
      next(error);
    }
  }
}

export default UploadController;
