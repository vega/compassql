import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {generate} from '../src/generate';
import {group, dataKey, encodingKey} from '../src/group';
import {SHORT_ENUM_SPEC} from '../src/query';
import {Schema} from '../src/schema';
import {Stats} from '../src/stats';
import {keys} from '../src/util';


describe('group', () => {
  const schema = new Schema([]);
  const stats = new Stats([]);

  describe('dataKey', () => {
    it('should group visualization with same data', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: SHORT_ENUM_SPEC,
          field: 'a',
          type: Type.QUANTITATIVE,
          aggregate: {
            name: 'a0',
            enumValues: [AggregateOp.MEAN, AggregateOp.MEDIAN]
          }
        }, {
          channel: SHORT_ENUM_SPEC,
          field: 'b',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, dataKey);

      // two because have two different aggregation
      assert.equal(keys(groups).length, 2);
    });
  });

  describe('encodingKey', () => {
    it('should group transposed visualizations', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'b',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'b',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SIZE]},
          field: 'c',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'b',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SHAPE]},
          field: 'c',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 1);
    });


    it('should group visualizations with different retinal variables or transposed', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'b',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SIZE]},
          field: 'c',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 1);
    });

    it('should group transposed facets visualizations', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'b',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.ROW, Channel.COLUMN]},
          field: 'c',
          type: Type.ORDINAL
        }, {
          channel: {enumValues: [Channel.ROW, Channel.COLUMN]},
          field: 'd',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 1);
    });


    it('should not group visualizations that map same variable to y and color', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'a',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.Y, Channel.COLOR]},
          field: 'c',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats, {omitNonPositionalOverPositionalChannels: false});
      const groups = group(answerSet, encodingKey);
      assert.equal(keys(groups).length, 2);
    });
  });
});
