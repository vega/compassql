#!/usr/bin/env node
const fs = require('fs');
const cql = require('../../build/compassql');

const Model = require('./model.js');
const Recommender = require('./recommender.js');

(() => {
  const fieldsToTypes = new Map([['nominal', 'Origin'], ['quantitative', 'Horsepower']]);
  const model = new Model('data/cars.json', fieldsToTypes, ['quantitative', 'nominal']);
  const query = model.generate();

  console.log(JSON.stringify(query));

  const recommender = new Recommender();
  const results = recommender.generate(query);

  console.log(results);
})();