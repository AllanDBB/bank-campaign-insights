class BaseModelStrategy {
  constructor(name) {
    if (new.target === BaseModelStrategy) {
      throw new TypeError('Cannot instantiate BaseModelStrategy directly');
    }
    this.name = name;
    this.isLoaded = false;
  }

  async loadModel() {
    throw new Error('loadModel() must be implemented');
  }

  /**
   * @param {object} features Already validated feature payload
   * @returns {{ probability: number, contributions: Array<{feature:string,label:string,value:any,weight:number,contribution:number}> }}
   */
  async predict(features) {
    throw new Error('predict() must be implemented');
  }
}

export default BaseModelStrategy;
