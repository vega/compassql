import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {generate} from '../src/generate';
import {nest, DATA, ENCODING, SpecQueryModelGroup} from '../src/nest';
import {SHORT_ENUM_SPEC} from '../src/query';

import {schema, stats} from './fixture';

describe('nest', () => {
  describe('data', () => {
    it('should group visualization with same data', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: SHORT_ENUM_SPEC,
          field: 'Q',
          type: Type.QUANTITATIVE,
          aggregate: {
            name: 'a0',
            enumValues: [AggregateOp.MEAN, AggregateOp.MEDIAN]
          }
        }, {
          channel: SHORT_ENUM_SPEC,
          field: 'O',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: DATA}]).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 2);
      assert.equal(groups[0].name, 'O,o|mean(Q,q)');
      assert.equal(groups[1].name, 'O,o|median(Q,q)');
    });
  });

  describe('encoding', () => {
    it('should group transposed visualizations', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'Q2',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'Q1',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SIZE]},
          field: 'Q2',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'Q1',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SHAPE]},
          field: 'O',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 1);
    });


    it('should group visualizations with different retinal variables or transposed', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'Q1',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.COLOR, Channel.SIZE]},
          field: 'Q2',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 1);
    });

    it('should group transposed facets visualizations', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: Channel.Y,
          field: 'Q1',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.ROW, Channel.COLUMN]},
          field: 'O',
          type: Type.ORDINAL
        }, {
          channel: {enumValues: [Channel.ROW, Channel.COLUMN]},
          field: 'N',
          type: Type.NOMINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 1);
    });


    it('should not group visualizations that map same variable to y and color', () => {
      const query = {
        mark: SHORT_ENUM_SPEC,
        encodings: [{
          channel: Channel.X,
          field: 'Q',
          type: Type.QUANTITATIVE
        }, {
          channel: {enumValues: [Channel.Y, Channel.COLOR]},
          field: 'Q1',
          type: Type.QUANTITATIVE
        }]
      };

      const answerSet = generate(query, schema, stats, {omitNonPositionalOverPositionalChannels: false});
      const groups = nest(answerSet, [{groupBy: ENCODING}]).items;
      assert.equal(groups.length, 2);
    });
  });

  describe('data, encoding', () => {
    it('should group visualization with same data, then by encoding', () => {
      const query = {
        mark: Mark.POINT,
        encodings: [{
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'Q',
          type: Type.QUANTITATIVE,
          aggregate: {
            name: 'a0',
            enumValues: [AggregateOp.MEAN, AggregateOp.MEDIAN]
          }
        }, {
          channel: {enumValues: [Channel.X, Channel.Y]},
          field: 'O',
          type: Type.ORDINAL
        }]
      };

      const answerSet = generate(query, schema, stats);
      const groups = nest(answerSet, [{groupBy: DATA}, {groupBy: ENCODING}]).items as SpecQueryModelGroup[];

      // two because have two different aggregation
      assert.equal(groups.length, 2);
      assert.equal(groups[0].name, 'O,o|mean(Q,q)');
      assert.equal(groups[1].name, 'O,o|median(Q,q)');

      assert.equal(groups[0].items.length, 1);
      assert.equal((groups[0].items[0] as SpecQueryModelGroup).name, 'xy:O,o|xy:mean(Q,q)');

      assert.equal(groups[1].items.length, 1);
      assert.equal((groups[1].items[0] as SpecQueryModelGroup).name, 'xy:O,o|xy:median(Q,q)');
    });
  });
});
