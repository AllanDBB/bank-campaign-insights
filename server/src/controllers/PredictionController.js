import PredictionService from '../services/prediction/PredictionService.js';

class PredictionController {
  constructor() {
    this.predictionService = new PredictionService();
  }

  async score(req, res, next) {
    try {
      const result = await this.predictionService.scoreProspect(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getConfig(req, res, next) {
    try {
      const config = await this.predictionService.getConfig();
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }

  async updateConfig(req, res, next) {
    try {
      const user = req.user.id || 'manager';
      const config = await this.predictionService.updateConfig(req.body, user);
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  }
}

export default PredictionController;
