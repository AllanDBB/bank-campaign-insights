class BaseProspectTemplate {
  async execute(formData) {
    const normalized = this.normalize(formData);
    this.validate(normalized);
    const payload = this.mapToPayload(normalized);
    const response = await this.callModel(payload);
    return this.formatResponse(response);
  }

  normalize(formData) {
    return formData;
  }

  validate() {}

  mapToPayload(formData) {
    return formData;
  }

  async callModel() {
    throw new Error('callModel must be implemented');
  }

  formatResponse(response) {
    return response;
  }
}

export default BaseProspectTemplate;
