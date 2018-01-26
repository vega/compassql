#!/usr/bin/env node
const fs = require('fs');

const Model = require('./model.js');
const Recommender = require('./recommender.js');
const Schema = require('./schema.js');

const util = require('./util.js');
const cql = require('../../build/compassql');

const SCHEMA_FILE = '../schemas/cars.schema.json';
const DATA_URL = '../data/cars.json';
const TYPES = ['quantitative', 'temporal', 'nominal', 'ordinal'];
const OUTPUT_DIRECTORY = '../cars';

function main() {
  const schema = new Schema(SCHEMA_FILE);

  for (let d = 1; d <= 4; d++) {
    console.log('generating output for ' + d + ' dimensions...');
    const queries = generateQueries(DATA_URL, schema, TYPES, d);

    const rec = new Recommender();
    const results = [];
    const tags = [];
    for (const query of queries) {
      const recs = rec.generate(query[1]);
      results.push(recs);
      tags.push(query[0]);
    }

    const outputDir = OUTPUT_DIRECTORY + '/' + d + 'D';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    outputRecommendations(results, tags, outputDir);
  }
}

/**
 * Outputs svgs to a directory structure reflecting the
 * groups within recs.
 *
 * @param {recommendation[]} recs An array of compassQL result
 *        trees.
 */
function outputRecommendations(recs, tags, basedir) {
  let index = 0;

  function buildTree(tree, dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (!cql.result.isResultTree(tree)) {
      const specString = JSON.stringify(tree, null, 2);
      let outbase = dir + '/' + index;
      fs.writeFile(outbase + '.json', specString, (err) => {
        if (err) throw err;
      });

      util.vl2png(tree, outbase + '.png');
      index += 1;
    } else {
      for (const item of tree.items) {
        buildTree(item, dir);
      }
    }
  }

  for (let i = 0; i < recs.length; i++) {
    console.log('\t' + tags[i] + '...');
    buildTree(recs[i], basedir+ '/' + tags[i]);
    index = 0;
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
                     remainingDim, chosenTypes, seen, results) {

    if (remainingDim === 0) {
      // Ready to create query.
      if (sortAndCheckSeen(seen, chosenTypes)) {
        return;
      } else {
        seen.push(JSON.stringify(chosenTypes));

        const model = new Model(dataUrl, schema, chosenTypes);
        const query = model.generate();
        if (query != null) {
          results.push([chosenTypes, query]);
        }
      }
    } else {
      // Keep enumerating types.
      for (const type of typeOptions) {
        newChosenTypes = util.clone(chosenTypes);
        newChosenTypes.push(type);

        generate(dataUrl, schema, typeOptions,
                remainingDim - 1, newChosenTypes, seen, results);
      }
    }
  }

  const results = [];
  generate(dataUrl, schema, typeOptions, dimensions, [], [], results);
  return results;
}

/**
 * Returns true iff the list of chosen types has been seen before (e.g.
 * exists in some order in seen). Also sorts `types` in place.
 *
 * @param {string[]} seen A list of sorted string representations of type
 *        arrays.
 * @param {string[]} types The types to sort and check.
 *
 * @return {boolean} True iff types has been seen before.
 */
function sortAndCheckSeen(seen, types) {
  types.sort();
  const typesString = JSON.stringify(types);
  for (const candidate of seen) {
    if (typesString === seen) {
      return true;
    }
  }
  return false;
}

main();