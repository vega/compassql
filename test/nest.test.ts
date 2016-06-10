import {assert} from 'chai';

import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {generate} from '../src/generate';
import {nest, DATA, ENCODING, TRANSPOSE, SpecQueryModelGroup} from '../src/nest';
import {SHORT_ENUM_SPEC, DEFAULT_QUERY_CONFIG} from '../src/query';

import {schema, stats} from './fixture';

describe('nest', () => {
  describe('data', () => {
    it('should group visualization with same data', () => {
      const query = {
        spec: {
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
        },
        nest: [{groupBy: DATA}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema, stats);
      const groups = nest(answerSet, query, stats).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 2);
      assert.equal(groups[0].name, 'O,o|mean(Q,q)');
      assert.equal(groups[1].name, 'O,o|median(Q,q)');
    });
  });

  describe('encoding', () => {
    it('should group visualizations with different retinal variables', () => {
      const query = {
        spec: {
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
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema, stats);
      const groups = nest(answerSet, query, stats).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query = {
        spec: {
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
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema, stats);
      const groups = nest(answerSet, query, stats).items;
      assert.equal(groups.length, 1);
    });


    it('should group visualizations with different retinal variables or transposed', () => {
      const query = {
        spec: {
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
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema, stats);
      const groups = nest(answerSet, query, stats).items;
      assert.equal(groups.length, 1);
    });
  });

  describe('encoding/transpose', () => {
    [ENCODING, TRANSPOSE].forEach((groupBy) => {
        it(groupBy + ' should group transposed visualizations', () => {
        const query = {
          spec: {
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
          },
          nest: [{groupBy: groupBy}],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema, stats);
        const groups = nest(answerSet, query, stats).items;
        assert.equal(groups.length, 1);
      });

      it(groupBy + ' should group transposed facets visualizations', () => {
        const query = {
          spec: {
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
          },
          nest: [{groupBy: groupBy}],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema, stats);
        const groups = nest(answerSet, query, stats).items;
        assert.equal(groups.length, 1);
      });


      it(groupBy + ' should not group visualizations that map same variable to y and color', () => {
        const query = {
          spec: {
            mark: Mark.POINT,
            encodings: [{
              channel: Channel.X,
              field: 'Q',
              type: Type.QUANTITATIVE
            }, {
              channel: {enumValues: [Channel.Y, Channel.COLOR]},
              field: 'Q1',
              type: Type.QUANTITATIVE
            }]
          },
          nest: [{groupBy: groupBy}],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema, stats, {omitNonPositionalOverPositionalChannels: false});
        const groups = nest(answerSet, query, stats).items;
        assert.equal(groups.length, 2);
      });
    });
  });

  describe('data, encoding', () => {
    it('should group visualization with same data, then by encoding', () => {
      const query = {
        spec: {
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
        },
        nest: [{groupBy: DATA}, {groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema, stats);
      const groups = nest(answerSet, query, stats).items as SpecQueryModelGroup[];

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
