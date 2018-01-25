/**
 * A Model represents a compassQL query.
 */
class Model {
  /**
   * Constructs a new Model with the given types.
   * @param {string} dataUrl The url of the data.
   * @param {Map<string, string[]>} typesToFields A mapping from type to
   *      an array of fields that match that type.
   * @param {string[]} queryTypes A list of types to encode, e.g. [Q, Q].
   *    Possible values include
   *          Q (Quantitative)
   *          O (Ordinal)
   *          N (Nominal)
   *          T (Time)
   */
  constructor(dataUrl, typesToFields, queryTypes) {
    this.dataUrl = dataUrl;
    this.typesToFields = typesToFields;
    this.queryTypes = queryTypes;
  }

  /**
   * @return {Query} A compassQL query for this.
   */
  generate() {
    const spec = {};
    spec['data'] = {'url': this.dataUrl};
    spec['mark'] = '?';

    const encodings = [];
    for (let i = 0; i < this.queryTypes.length; i++) {
      const encoding = {};
      encoding['channel'] = '?';
      encoding['type'] = this.queryTypes[i];
      encoding['field'] = this.typesToFields.get(this.queryTypes[i]);

      console.log(this.queryTypes[i]);
      console.log(this.typesToFields);

      encodings.push(encoding);
    }
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

    return JSON.parse(JSON.stringify(query));
  }
}

module.exports = Model;