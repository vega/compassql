/**
 * A Model represents a compassQL query.
 */
class Model {
  /**
   * Constructs a new Model with the given types.
   * @param {string} dataUrl The url of the data.
   * @param {Schema} schema A Schema iterator that describes
   *        the types to field fo the given data.
   * @param {string[]} queryTypes A list of types to encode, e.g. [Q, Q].
   *        Possible values include
   *          Q (Quantitative)
   *          O (Ordinal)
   *          N (Nominal)
   *          T (Time)
   */
  constructor(data, schema, fieldTypes, fieldAggregates, fieldBins) {
    this.data = data;
    this.schema = schema;
    this.fieldTypes = fieldTypes;
    this.fieldAggregates = fieldAggregates;
    this.fieldBins = fieldBins;
  }

  /**
   * @return {Query} A compassQL query for this.
   */
  generate() {
    this.schema.ready();

    const spec = {};
    spec['data'] = {
      values: this.data
    };

    spec['mark'] = '?';

    const encodings = [];
    for (let i = 0; i < this.fieldTypes.length; i++) {
      const encoding = {};
      encoding['channel'] = '?';
      encoding['type'] = this.fieldTypes[i];

      const field = this.schema.getNextField(this.fieldTypes[i]);
      if (field == null) {
        return null;
      }
      encoding['field'] = field;

      if (this.fieldBins[i]) {
        encoding['bin'] = this.fieldBins[i];
      }
      if (this.fieldAggregates[i]) {
        encoding['aggregate'] = this.fieldAggregates[i];
      }

      encodings.push(encoding);
    }
    this.schema.close();

    spec['encodings'] = encodings;

    const query = {};

    query['nest'] = [
      {
        'groupBy': [{
          'property': 'channel',
          'replace': {
            'x': 'xy', 'y': 'xy',
            'row': 'facet', 'column': 'facet'
          }
        }],
        'orderGroupBy': 'effectiveness'
      }
    ];
    query['spec'] = spec;
    query['orderBy'] = 'effectiveness';

    return query;
  }
}

export default Model;