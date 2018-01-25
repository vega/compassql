#!/usr/bin/env node
const Model = require('./model.js');
const Recommender = require('./recommender.js');
const Schema = require('./schema.js');

const SCHEMA_FILE = '../schemas/cars.schema.json';
const DATA_URL = 'data/cars.json';
const TYPES = ['quantitative', 'temporal', 'nominal', 'ordinal'];

function main() {
  const schema = new Schema(SCHEMA_FILE);

  const queries = generateQueries(DATA_URL, schema, TYPES, 2);

  const rec = new Recommender();
  const results = [];
  for (const query of queries) {
    const result = rec.generate(query[1]);
    results.push(result);
  }
}

/**
 * Generates a list of compassQL queries over the search
 * space o the given typeOptions in the given number of
 * dimensions.
 *
 * @param {string} dataUrl The url of the data.
 * @param {Schema} schema The schema of the data.
 * @param {string[]} typeOptions The options for the types of fields.
 * @param {number} dimensions The number of dimensions for the result.
 *
 * @return {Query[]} A list of compassQL queries.
 */
function generateQueries(dataUrl, schema, typeOptions, dimensions) {
  function generate(dataUrl, schema, typeOptions,
                     remainingDim, chosenTypes, results) {

    if (remainingDim === 0) {
      const model = new Model(dataUrl, schema, chosenTypes);
      const query = model.generate();
      if (query != null) {
        results.push([clone(chosenTypes), query]);
      }
    } else {
      for (const type of typeOptions) {
        newChosenTypes = clone(chosenTypes);
        newChosenTypes.push(type);

        generate(dataUrl, schema, typeOptions,
                remainingDim - 1, newChosenTypes, results);
      }
    }
  }

  const results = [];
  generate(dataUrl, schema, typeOptions, dimensions, [], results);
  return results;
}

/**
 * Returns a deep copy of the given object (must be serializable).
 *
 * @param {Object} obj The object to clone.
 * @return {Object} A deep copy of obj.
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

main();