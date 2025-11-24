class PredictionTemplate {
  constructor(strategy, interpreter, recommender, justificationService) {
    if (new.target === PredictionTemplate) {
      throw new TypeError('Cannot instantiate PredictionTemplate directly');
    }
    this.strategy = strategy;
    this.interpreter = interpreter;
    this.recommender = recommender;
    this.justificationService = justificationService;
  }

  async execute(rawPayload) {
    const validated = this.validate(rawPayload);
    const prepared = this.preprocess(validated);
    const prediction = await this.runModel(prepared);
    const interpretation = this.interpreter.interpret(prediction.probability);
    const recommendation = this.recommender.recommend(prediction.probability);
    const justification = this.justificationService.buildJustification(
      prediction.contributions,
      prediction.probability
    );

    return this.formatResponse({
      probability: prediction.probability,
      contributions: prediction.contributions,
      interpretation,
      recommendation,
      justification
    });
  }

  validate(payload) {
    return payload;
  }

  preprocess(payload) {
    return payload;
  }

  async runModel(payload) {
    return this.strategy.predict(payload);
  }

  formatResponse(result) {
    return result;
  }
}

export default PredictionTemplate;
