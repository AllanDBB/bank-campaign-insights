import UploadService from '../services/UploadService.js';

class UploadController {
  constructor() {
    this.uploadService = new UploadService();
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please provide a CSV file.'
        });
      }

      const file = req.file;
      console.log(`Received file upload: ${file.originalname}, size: ${file.size} bytes`);

      const result = await this.uploadService.validateFile(file.buffer);

      const response = {
        success: true,
        message: 'Upload completed successfully',
        data: {
          totalRecords: result.totalRecords,
          successfulInserts: result.successfulInserts,
          failedInserts: result.failedInserts,
          successPercentage: result.successPercentage
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
      console.error('Error in uploadFile:', error);
      next(error);
    }
  }
}

export default UploadController;
