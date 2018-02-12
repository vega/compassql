class Schema {
  /**
   * Constructs a new Schema for the given dataset.
   *
   * @param {string} schemaFile The path to the .json
   *        file describing the schema.
   */
  constructor(schemaSpec) {
    this.types = new Map();
    this.typesIterator = new Map();

    // read the schema file
    this.schema = schemaSpec;

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
      const fieldsCopy = JSON.parse(JSON.stringify(this.types.get(type)));
      this.typesIterator.set(type, fieldsCopy);
    }
  }

  /**
   * Returns the next field for the given type, null
   * if there are no more fields for the given type.
   *
   * @param {string} type The type requested: e.g. 'nominal', 'quantitative'.
   */
  getNextField(type) {
    if (!this.typesIterator.has(type)) {
      return null;
    }

    const fields = this.typesIterator.get(type);
    if (fields.length === 0) {
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

export default Schema;