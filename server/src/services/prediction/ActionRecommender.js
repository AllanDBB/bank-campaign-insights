class ActionRecommender {
  constructor(config) {
    this.config = config;
  }

  recommend(probability) {
    const ranges = this.config?.actionRanges || [];
    const match = ranges.find(r => probability >= r.min && probability < r.max) || ranges[ranges.length - 1];

    return match || {
      label: 'Sin definir',
      action: 'Sin recomendación',
      min: 0,
      max: 1
    };
  }
}

export default ActionRecommender;
