const cql = require('compassql');

const REPLACE = {
  property: 'channel',
  replace: {x: 'xy', y: 'xy', row: 'facet', column: 'facet'},
};

/**
 * A Recommender generates vega-lite specifications for a
 * given compassQL query.
 */
class Recommender {
  constructor(schema) {
    this.schema = schema;
  }
  /**
   * Generates a series of unique vega-lite specs resulting from
   * the given compassQL query.
   *
   * @param {Query} query The compassQL query to use.
   * @return {Object[]} A series of (unnested) vega-lite specs.
   */
  generate(query) {
    const data = query['spec']['data']['values'];

    const opt = {};

    const recs = cql.recommend(query, this.schema, opt)['result'];

    const results = [];
    const seen = new Set();
    const resultTree = cql.result.mapLeaves(recs, (item) => {
      const id = item.toShorthand([REPLACE]);
      if (!seen.has(id)) {
        seen.add(id);
        const spec = item.toSpec();
        const score = item._rankingScore.effectiveness.score;
        results.push({
          spec: spec,
          score: score,
        });
      }
    });

    return results;
  }
}

export default Recommender;