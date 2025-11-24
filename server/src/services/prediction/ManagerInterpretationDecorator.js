import ProbabilityInterpreter from './ProbabilityInterpreter.js';

class ManagerInterpretationDecorator extends ProbabilityInterpreter {
  constructor(baseInterpreter, overrideConfig) {
    super(overrideConfig);
    this.baseInterpreter = baseInterpreter;
  }

  interpret(probability) {
    const managerResult = super.interpret(probability);
    const baseResult = this.baseInterpreter.interpret(probability);

    return {
      decision: managerResult.decision,
      range: managerResult.range || baseResult.range,
      source: managerResult.range ? 'manager' : 'default'
    };
  }
}

export default ManagerInterpretationDecorator;
