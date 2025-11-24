import fs from 'fs';
import path from 'path';
import BaseModelStrategy from './BaseModelStrategy.js';

class LogisticModelStrategy extends BaseModelStrategy {
  constructor() {
    super('logistic-regression');
    this.model = null;
    this.modelPath = path.resolve(process.cwd(), 'src', 'models', 'prediction', 'logistic-model.json');
  }

  async loadModel() {
    if (this.isLoaded && this.model) return this.model;

    const raw = await fs.promises.readFile(this.modelPath, 'utf-8');
    this.model = JSON.parse(raw);
    this.isLoaded = true;
    return this.model;
  }

  async predict(features) {
    await this.loadModel();

    const { intercept, numericWeights, categoricalWeights } = this.model;

    const contributions = [];
    let logit = intercept;
    contributions.push({
      feature: 'intercept',
      label: 'Intercepto',
      value: 1,
      weight: intercept,
      contribution: intercept
    });

    Object.entries(numericWeights).forEach(([key, weight]) => {
      const value = Number(features[key] ?? 0);
      const contribution = weight * value;
      logit += contribution;
      contributions.push({
        feature: key,
        label: key,
        value,
        weight,
        contribution
      });
    });

    Object.entries(categoricalWeights).forEach(([key, mapping]) => {
      const value = features[key];
      const weight = mapping?.[value] ?? 0;
      const contribution = weight;
      logit += contribution;
      contributions.push({
        feature: key,
        label: key,
        value,
        weight,
        contribution
      });
    });

    const probability = 1 / (1 + Math.exp(-logit));

    return {
      probability,
      contributions
    };
  }
}

export default LogisticModelStrategy;
