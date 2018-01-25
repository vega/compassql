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
  constructor(dataUrl, schema, queryTypes) {
    this.dataUrl = dataUrl;
    this.schema = schema;
    this.queryTypes = queryTypes;
  }

  /**
   * @return {Query} A compassQL query for this.
   */
  generate() {
    this.schema.ready();

    const spec = {};
    spec['data'] = {'url': this.dataUrl};
    spec['mark'] = '?';

    const encodings = [];
    for (let i = 0; i < this.queryTypes.length; i++) {
      const encoding = {};
      encoding['channel'] = '?';
      encoding['type'] = this.queryTypes[i];

      const field = this.schema.getNextField(this.queryTypes[i]);
      if (field == null) {
        return null;
      }
      encoding['field'] = field;

      encodings.push(encoding);
    }
    this.schema.close();

    spec['encodings'] = encodings;

    const nest = [
      {
        "groupBy": ["field", "aggregate", "bin", "timeUnit", "stack"],
        "orderGroupBy": "aggregationQuality"
      },
      {
        "groupBy": [{
          "property": "channel",
          "replace": {
            "x": "xy", "y": "xy",
            "color": "style", "size": "style", "shape": "style", "opacity": "style",
            "row": "facet", "column": "facet"
          }
        }],
        "orderGroupBy": "effectiveness"
      },
      {
        "groupBy": ["channel"],
        "orderGroupBy": "effectiveness"
      }
    ];

    const query = {};

    query['spec'] = spec;
    query['nest'] = nest;
    query['orderBy'] = 'effectiveness';

    return query;
  }
}

module.exports = Model;