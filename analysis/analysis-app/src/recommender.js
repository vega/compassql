const cql = require('compassql');
/**
 * A Recommender generates vega-lite specifications for a
 * given compassQL query.
 */
class Recommender {
  /**
   * Generates a series of vega-lite specs resulting from
   * the given compassQL query.
   *
   * @param {Query} query The compassQL query to use.
   * @return {Object[]} A series of (unnested) vega-lite specs.
   */
  generate(query) {
    const data = query['spec']['data']['values'];

    const schema = cql.schema.build(data);
    const opt = {};

    const recs = cql.recommend(query, schema, opt)['result'];

    const vlTree = cql.result.mapLeaves(recs, (item) => {
      return item.toSpec();
    });

    return vlTree.items;
  }
}

export default Recommender;