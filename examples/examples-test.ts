import {assert} from 'chai';
import {query} from '../src/query';
import {isSpecQueryModelGroup, SpecQueryModelGroup} from '../src/nest'; //?????
const load = require('datalib/src/import/load');
//const stats = require('datalib/src/stats'); // << never seen this before 
//console.log('felix was here' + summary);

import {summary} from 'datalib/src/stats';
import {ExtendedUnitSpec} from '../node_modules/vega-lite/src/spec';


import {Stats} from '../src/stats';
import {Query} from '../src/query';

const inspect = require('util').inspect
const fs = require('fs');
const path = require('path');
const zSchema = require('z-schema');

function contains<T>(array: Array<T>, item: T) {
  return array.indexOf(item) > -1;
}

zSchema.registerFormat('color', function (str) {
  // valid colors are in list or hex color
  return contains(['purple'], str) || /^#([0-9a-f]{3}){1,2}$/i.test(str);
});
zSchema.registerFormat('font', function (str) {
  // right now no fonts are valid
  return false;
});

const validator = new zSchema({
  noEmptyArrays: true,
  noEmptyStrings: true
});

const cqlSchema = require('../compassql-schema.json');
const vlSchema = require('../node_modules/vega-lite/vega-lite-schema.json');

function generatedStats(url: String) {  
function generatedStats(filepath: String) {  

  var data = load({url: filepath});
 // console.log(data);
  var summ = summary(data);      
  return new Stats(summ);
};


function validateCQL(spec) {
  const valid = validator.validate(spec, cqlSchema);
  const errors = validator.getLastErrors();

  if (!valid) {
    console.log(inspect(errors, { depth: 10, colors: true }));
  }
  assert(valid, errors && errors.map((err) => {return err.message; }).join(', '));
}

// /*
function validateVL(qry: Query) {  
  validateSpecModelGroup(query(qry, cqlSchema, generatedStats('node_modules/vega-datasets/' + qry.spec.data.url))); //remove nesting
}

function validateSpecModelGroup(specMD: SpecQueryModelGroup) {
  specMD.items.forEach((item) => {
    if (!isSpecQueryModelGroup(item)) {

      var spec : ExtendedUnitSpec = item.toSpec();
      const valid = validator.validate(spec, vlSchema);
      const errors = validator.getLastErrors();
      if (!valid) {
        console.log(inspect(errors, { depth: 10, colors: true }));
      }
      assert(valid, errors && errors.map((err) => {return err.message; }).join(', '));
    } else {
      validateSpecModelGroup(item);
    }
  });
}

// */

describe('Examples', function() {
  const examples = fs.readdirSync('examples/specs');

  examples.forEach(function(example) {
    if (path.extname(example) !== '.json') { return; }
    const jsonSpec = JSON.parse(fs.readFileSync('examples/specs/' + example));

    describe(example, function() {
      it('should be valid compassQL', function(){
        validateCQL(jsonSpec); 
      });

     it('should produce valid vega-lite', function() {
        validateVL(jsonSpec); //TODO
      });
    });
  });
});
