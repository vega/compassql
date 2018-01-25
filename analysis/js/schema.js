const fs = require('fs');

class Schema {
  /**
   * Constructs a new Schema for the given dataset.
   *
   * @param {string} schemaFile The path to the .json
   *        file describing the schema.
   */
  constructor(schemaFile) {
    this.types = new Map();
    this.typesIterator = new Map();

    // read the schema file
    this.schema = require(schemaFile);

    // create types => fields map
    for (const field in this.schema) {
      const type = this.schema[field];
      if (!this.types.has(type)) {
        this.types.set(type, []);
      }
      this.types.get(type).push(field);
    }
  }

  /**
   * Returns the schema backing this
   *
   * @return {Object} The object mapping fieldName to type for the data
   *        this represents.
   */
  getSchema() {
    return this.schema;
  }

  /**
   * Prepares this to return a sequence of fields.
   */
  ready() {
    for (const type of this.types.keys()) {
      this.typesIterator[type] = this.types.get(type);
    }
  }

  /**
   * Returns the next field for the given type, null
   * if there are no more fields for the given type.
   *
   * @param {string} type The type requested: e.g. 'nominal', 'quantitative'.
   */
  getNextField(type) {
    console.log(type);
    console.log(this.typesIterator);
    console.log(this.typesIterator.get('nominal'));
    // console.log(this.typesIterator.get(type));
    if (!this.typesIterator.has(type)) {
      return null;
    }

    const fields = this.typesIterator.get(type);
    // console.log(fields);
    if (fields.length == 0) {
      return null;
    }

    return fields.shift();
  }

  /**
   * Resets this to return a sequence of fields.
   */
  reset() {
    this.close();
    this.open();
  }

  /**
   * Closes this.
   */
  close () {
    this.typesIterator.clear();
  }
}

module.exports = Schema;