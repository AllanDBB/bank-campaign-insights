class ProbabilityInterpreter {
  constructor(config) {
    this.config = config;
  }

  interpret(probability) {
    const ranges = this.config?.interpretationRanges || [];
    const range = ranges.find(r => probability >= r.min && probability < r.max) || ranges[ranges.length - 1];

    const acceptanceThreshold = this.config?.acceptanceThreshold ?? 0.5;
    const decision = probability >= acceptanceThreshold ? 'Sí' : 'No';

    return {
      decision,
      range: range || null
    };
  }
}

export default ProbabilityInterpreter;
