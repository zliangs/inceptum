
const { ObjectDefinition } = require('./ObjectDefinition');

class PreinstantiatedSingletonDefinition extends ObjectDefinition {
  constructor(instance, name, logger) {
    if (typeof instance !== 'object') {
      throw new Error(`Only objects can be used as preinstatiated objects. Provided a ${typeof instance} for Object Definition ${name}`);
    }
    super(instance.constructor, name, logger);
    this.instance = instance;
    this.withLazyLoading(false);
  }

  * getInstance() {
    yield null;
    return this.instance;
  }

  * doStart() {
    yield null;
  }

  * doStop() {
    yield null;
  }
}

module.exports = { PreinstantiatedSingletonDefinition };