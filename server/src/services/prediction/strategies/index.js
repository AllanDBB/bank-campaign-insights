import LogisticModelStrategy from './LogisticModelStrategy.js';

class StrategyFactory {
  constructor() {
    this.registry = {
      logistic: new LogisticModelStrategy()
    };
  }

  get(strategyName = 'logistic') {
    const strategy = this.registry[strategyName];
    if (!strategy) {
      throw new Error(`Model strategy ${strategyName} not found`);
    }
    return strategy;
  }
}

export default new StrategyFactory();
