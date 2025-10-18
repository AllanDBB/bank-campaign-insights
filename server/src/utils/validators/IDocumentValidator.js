class IDocumentValidator {
  validate(document) {
    throw new Error('Method validate() must be implemented by subclass');
  }
}

export default IDocumentValidator;
