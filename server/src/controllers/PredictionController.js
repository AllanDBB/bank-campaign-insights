import PredictionService from '../services/prediction/PredictionService.js';
import RBACService from '../services/RBACService.js';

class PredictionController {
  constructor() {
    this.predictionService = new PredictionService();
  }

  async score(req, res, next) {
    try {
      const result = await this.predictionService.scoreProspect(req.body);
      const permissions = await RBACService.getPermissions(req.user.role);

      const filtered = {};

      if (permissions.viewProspects) {
        filtered.contributions = result.contributions;
      }

      if (permissions.viewProbability) {
        filtered.probability = result.probability;
      }

      if (permissions.viewInterpretation) {
        filtered.interpretation = result.interpretation;
      }

      if (permissions.viewRecommendation) {
        filtered.recommendation = result.recommendation;
      }

      if (permissions.viewFactorAnalysis) {
        filtered.justification = result.justification;
      }

      if (permissions.simulateScenarios) {
        filtered.scenarioCapabilities = true;
      }

      filtered.configSource = result.configSource;

      res.status(200).json({ success: true, data: filtered });
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
