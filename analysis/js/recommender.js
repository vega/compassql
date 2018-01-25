#!/usr/bin/env node

const fs = require('fs');
const cql = require('../../build/compassql');

/**
 * A Recommender generates vega-lite specifications for a
 * given compassQL query.
 */
class Recommender {

  /**
   * Constructs a new Recommender using the given compassQL query.
   */
  constructor() {
  }

  /**
   * Generates a series of vega-lite specs resulting from
   * the given compassQL query.
   *
   * @param {Query} query The compassQL query to use.
   * @return {Object[]} A series of nested vega-lite specs.
   */
  generate(query) {
    const dataUrl = query['spec']['data']['url'];
    const data = require(`vega-datasets/${dataUrl}`);

    const schema = cql.schema.build(data);
    const opt = {};

    const recommendations = cql.recommend(query, schema, opt);

    const vlTree = cql.result.mapLeaves(recommendations, (item) => {
      return item.toSpec();
    });

    return vlTree;
  }
}

module.exports = Recommender;