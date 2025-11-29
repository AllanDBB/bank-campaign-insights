import StrategyFactory from './strategies/index.js';
import ProbabilityInterpreter from './ProbabilityInterpreter.js';
import ManagerInterpretationDecorator from './ManagerInterpretationDecorator.js';
import ActionRecommender from './ActionRecommender.js';
import InterpretationConfigRepository from './InterpretationConfigRepository.js';
import JustificationService from './JustificationService.js';
import LogisticPredictionTemplate from './LogisticPredictionTemplate.js';
import ComparisonService from "../ComparisonService.js";

class PredictionService {
  constructor() {
    this.configRepository = new InterpretationConfigRepository();
    this.justificationService = new JustificationService(3);
  }

  async getConfig() {
    return this.configRepository.load();
  }

  async updateConfig(data, user = 'manager') {
    const config = await this.getConfig();

    if (data.acceptanceThreshold !== undefined) {
      const threshold = Number(data.acceptanceThreshold);
      config.acceptanceThreshold = Math.min(Math.max(threshold, 0), 1);
    }

    if (data.interpretationRanges) {
      config.interpretationRanges = data.interpretationRanges
        .map(r => ({
          ...r,
          min: Number(r.min ?? 0),
          max: Number(r.max ?? 1)
        }))
        .sort((a, b) => a.min - b.min);
    }

    if (data.actionRanges) {
      config.actionRanges = data.actionRanges
        .map(r => ({
          ...r,
          min: Number(r.min ?? 0),
          max: Number(r.max ?? 1)
        }))
        .sort((a, b) => a.min - b.min);
    }

    config.lastUpdatedBy = user;
    return this.configRepository.save(config);
  }

  async scoreProspect(payload) {
    const config = await this.getConfig();
    const baseInterpreter = new ProbabilityInterpreter(config);
    const managerInterpreter = new ManagerInterpretationDecorator(baseInterpreter, config);
    const recommender = new ActionRecommender(config);
    const strategy = StrategyFactory.get('logistic');

    const template = new LogisticPredictionTemplate(
      strategy,
      managerInterpreter,
      recommender,
      this.justificationService
    );

    const result = await template.execute(payload);
    const enrichedResult = await ComparisonService.compareWithStats(result.contributions);

    return {
      ...result,
      contributions: enrichedResult,
      configSource: result.interpretation?.source || 'default'
    };
  }
}

export default PredictionService;
