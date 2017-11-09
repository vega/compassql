#!/usr/bin/env node
/**
 * Outputs a recommendation result for the given compassQL query.
 */
const fs = require('fs');
const cql = require('../build/compassql');

// arguments
const args = require('yargs')
    .usage('recommend.js <compassql_spec_file>')
    .argv;

const specFile = args._[0] || 'dev/stdin';

// read the spec file
fs.readFile(specFile, 'utf8', (err, text) => {
  if (err) throw err;
  const spec = JSON.parse(text);
  loadDataProcessAndRecommend(spec);
})

function loadDataProcessAndRecommend(spec) {
  // load the data.
  const dataSpec = spec.spec.data;
  if (dataSpec.url) {
    // load the data from the url
    const data = require(`vega-datasets/${dataSpec.url}`);
    processAndRecommend(data, spec);
  } else if (dataSpec.data.values) {
    processAndRecommend(dataSpec.data, spec);
  } else {
    // error.
    process.stdout.write('spec missing data');
  }
}

function processAndRecommend(data, spec) {
  // build the schema
  const schema = cql.schema.build(data);

  // the query is defined by the spec.
  const query = spec;

  // options
  const opt = {};

  // get the recommendation
  const output = cql.recommend(query, schema, opt);

  // get the resulting specs
  const result = cql.result.mapLeaves(output.result, (item) => {
    return cql.query.shorthand.vlSpec(item.toSpec());
  });

  const toWrite = JSON.stringify(result, null, 2);
  process.stdout.write(toWrite)
}