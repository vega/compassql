import {assert} from 'chai';


import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {generate} from '../src/generate';
import {SpecQueryModel, SpecQueryModelGroup} from '../src/model';
import {nest, FIELD, FIELD_TRANSFORM, ENCODING, TRANSPOSE} from '../src/nest';
import {Property} from '../src/property';
import {Query} from '../src/query/query';
import {REPLACE_BLANK_FIELDS, REPLACE_XY_CHANNELS, REPLACE_FACET_CHANNELS, REPLACE_MARK_STYLE_CHANNELS} from '../src/query/groupby';

import {SHORT_WILDCARD} from '../src/wildcard';
import {contains, extend} from '../src/util';

import {schema} from './fixture';

describe('nest', () => {
  describe('group by properties', () => {
    describe('field ignoring function', () => {
      it('should group visualization with same fields', () => {
        const query: Query = {
          spec: {
            mark: SHORT_WILDCARD,
            encodings: [{
              channel: SHORT_WILDCARD,
              field: 'Q',
              type: Type.QUANTITATIVE,
              aggregate: {
                name: 'a0',
                enum: ['mean', 'median']
              }
            }, {
              channel: SHORT_WILDCARD,
              field: 'O',
              type: Type.ORDINAL
            }]
          },
          nest: [{
            groupBy: [{property: Property.FIELD, replace: REPLACE_BLANK_FIELDS}]
          }],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema);
        const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

        assert.equal(groups.length, 1);
        assert.equal(groups[0].name, 'O|Q');
      });

      it('should group histogram and raw plots in the same group', () => {
        const query: Query = {
          spec: {
            mark: SHORT_WILDCARD,
            encodings: [{
              channel: SHORT_WILDCARD,
              field: 'Q',
              type: Type.QUANTITATIVE,
              bin: SHORT_WILDCARD,
              aggregate: SHORT_WILDCARD
            }]
          },
          nest: [{
            groupBy: [
              {property: Property.FIELD, replace: REPLACE_BLANK_FIELDS}
            ]
          }, {
            groupBy: [
              Property.AGGREGATE,
              Property.TIMEUNIT,
              Property.BIN,
              Property.STACK
            ]
          }],
          config: extend({autoAddCount: true}, DEFAULT_QUERY_CONFIG)
        };

        const answerSet = generate(query.spec, schema);
        const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

        assert.equal(groups.length, 1);
        assert.equal(groups[0].name, 'Q');
        assert.equal(groups[0].items.length, 3);
      });

      it('should group stacked and non-stacked plots of same fields in the same group', () => {
        const query: Query = {
          spec: {
            mark: SHORT_WILDCARD,
            encodings: [{
              channel: SHORT_WILDCARD,
              field: 'N',
              type: Type.NOMINAL
            },{
              channel: SHORT_WILDCARD,
              field: 'N1',
              type: Type.NOMINAL
            }]
          },
          nest: [{
            groupBy: [
              {property: Property.FIELD, replace: REPLACE_BLANK_FIELDS}
            ]
          }],
          config: extend({autoAddCount: true}, DEFAULT_QUERY_CONFIG)
        };

        const answerSet = generate(query.spec, schema);
        const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

        assert.equal(groups.length, 1);
        assert.equal(groups[0].name, 'N|N1');
      });
    });
  });

  describe('field, aggregate, bin, timeUnit', () => {
    it('should group visualization with same fields and transformations', () => {
      const query: Query = {
        spec: {
        mark: SHORT_WILDCARD,
          encodings: [{
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: Type.QUANTITATIVE,
            aggregate: {
              name: 'a0',
              enum: ['mean', 'median']
            }
          }, {
            channel: SHORT_WILDCARD,
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 2);
      assert.equal(groups[0].name, 'O,o|mean(Q,q)');
      assert.equal(groups[1].name, 'O,o|median(Q,q)');
    });
  });

  describe('field, aggregate, bin, timeUnit, channel, type', () => {
    it('should group visualizations with different retinal variables if has proper replace', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SIZE]},
            field: 'Q2',
            type: Type.QUANTITATIVE
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK,
            {property: Property.CHANNEL, replace: REPLACE_MARK_STYLE_CHANNELS}
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SHAPE]},
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK,
            {property: Property.CHANNEL, replace: REPLACE_MARK_STYLE_CHANNELS}
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables or transposed', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SIZE]},
            field: 'Q2',
            type: Type.QUANTITATIVE
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK,
            {property: Property.CHANNEL, replace: extend({}, REPLACE_XY_CHANNELS, REPLACE_MARK_STYLE_CHANNELS)}
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should separate different types of stacked and non-stacked visualizations', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            aggregate: 'sum',
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'N',
            type: Type.NOMINAL
          }, {
            channel: Channel.COLOR,
            field: 'N1',
            type: Type.NOMINAL
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK,
            {property: Property.CHANNEL, replace: extend({}, REPLACE_XY_CHANNELS, REPLACE_FACET_CHANNELS, REPLACE_MARK_STYLE_CHANNELS)}
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 2);
      assert.equal((groups[0] as SpecQueryModelGroup).name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[0] as SpecQueryModelGroup).items.forEach((item: SpecQueryModel) => {
        return !contains([Mark.BAR, Mark.AREA], item.getMark());
      });

      assert.equal((groups[1] as SpecQueryModelGroup).name, 'stack={field:sum(Q),by:N,offset:zero}|style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[1] as SpecQueryModelGroup).items.forEach((item: SpecQueryModel) => {
        return contains([Mark.BAR, Mark.AREA], item.getMark());
      });
    });

    it('should separate different types of stacked and non-stacked visualizations even if it is nested ', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            aggregate: 'sum',
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'N',
            type: Type.NOMINAL
          }, {
            channel: Channel.COLOR,
            field: 'N1',
            type: Type.NOMINAL
          }]
        },
        nest: [{
          groupBy: [
            Property.FIELD,
            Property.TYPE,
            Property.AGGREGATE,
            Property.BIN,
            Property.TIMEUNIT,
            Property.STACK,
            {property: Property.CHANNEL, replace: extend({}, REPLACE_XY_CHANNELS, REPLACE_FACET_CHANNELS, REPLACE_MARK_STYLE_CHANNELS)}
          ]
        }, {
          groupBy: [
            {property: Property.CHANNEL, replace: extend({}, REPLACE_MARK_STYLE_CHANNELS)}
          ]
        }],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 2);
      assert.equal((groups[0] as SpecQueryModelGroup).name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[0] as SpecQueryModelGroup).items.forEach((item: SpecQueryModelGroup) => {
        return !contains([Mark.BAR, Mark.AREA], (item.items[0] as SpecQueryModel).getMark());
      });

      assert.equal((groups[1] as SpecQueryModelGroup).name, 'stack={field:sum(Q),by:N,offset:zero}|style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[1] as SpecQueryModelGroup).items.forEach((item: SpecQueryModelGroup) => {
        return contains([Mark.BAR, Mark.AREA], (item.items[0] as SpecQueryModel).getMark());
      });
    });
  });

  describe('field', () => {
    it('should group visualization with same fields', () => {
      const query: Query = {
        spec: {
        mark: SHORT_WILDCARD,
          encodings: [{
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: Type.QUANTITATIVE,
            aggregate: {
              name: 'a0',
              enum: ['mean', 'median']
            }
          }, {
            channel: SHORT_WILDCARD,
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{groupBy: FIELD}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 1);
      assert.equal(groups[0].name, 'O|Q');
    });

    it('should group histogram and raw plots in the same group', () => {
      const query: Query = {
        spec: {
        mark: SHORT_WILDCARD,
          encodings: [{
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: Type.QUANTITATIVE,
            bin: SHORT_WILDCARD,
            aggregate: SHORT_WILDCARD
          }]
        },
        nest: [{groupBy: FIELD}, {groupBy: FIELD_TRANSFORM}],
        config: extend({autoAddCount: true}, DEFAULT_QUERY_CONFIG)
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 1);
      assert.equal(groups[0].name, 'Q');
      assert.equal(groups[0].items.length, 3);
    });
  });

  describe('fieldTransform', () => {
    it('should group visualization with same fields and transformations', () => {
      const query: Query = {
        spec: {
        mark: SHORT_WILDCARD,
          encodings: [{
            channel: SHORT_WILDCARD,
            field: 'Q',
            type: Type.QUANTITATIVE,
            aggregate: {
              name: 'a0',
              enum: ['mean', 'median']
            }
          }, {
            channel: SHORT_WILDCARD,
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{groupBy: FIELD_TRANSFORM}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[] ;

      // two because have two different aggregation
      assert.equal(groups.length, 2);
      assert.equal(groups[0].name, 'O,o|mean(Q,q)');
      assert.equal(groups[1].name, 'O,o|median(Q,q)');
    });
  });

  describe('encoding', () => {
    it('should group visualizations with different retinal variables', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SIZE]},
            field: 'Q2',
            type: Type.QUANTITATIVE
          }]
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SHAPE]},
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should group visualizations with different retinal variables or transposed', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'Q1',
            type: Type.QUANTITATIVE
          }, {
            channel: {enum: [Channel.COLOR, Channel.SIZE]},
            field: 'Q2',
            type: Type.QUANTITATIVE
          }]
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 1);
    });

    it('should separate different types of stacked and non-stacked visualizations', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            aggregate: 'sum',
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'N',
            type: Type.NOMINAL
          }, {
            channel: Channel.COLOR,
            field: 'N1',
            type: Type.NOMINAL
          }]
        },
        nest: [{groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 2);
      assert.equal((groups[0] as SpecQueryModelGroup).name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[0] as SpecQueryModelGroup).items.forEach((item: SpecQueryModel) => {
        return !contains([Mark.BAR, Mark.AREA], item.getMark());
      });

      assert.equal((groups[1] as SpecQueryModelGroup).name, 'stack={field:sum(Q),by:N,offset:zero}|style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[1] as SpecQueryModelGroup).items.forEach((item: SpecQueryModel) => {
        return contains([Mark.BAR, Mark.AREA], item.getMark());
      });
    });

    it('should separate different types of stacked and non-stacked visualizations even if it is nested ', () => {
      const query: Query = {
        spec: {
          mark: SHORT_WILDCARD,
          encodings: [{
            channel: Channel.X,
            aggregate: 'sum',
            field: 'Q',
            type: Type.QUANTITATIVE
          }, {
            channel: Channel.Y,
            field: 'N',
            type: Type.NOMINAL
          }, {
            channel: Channel.COLOR,
            field: 'N1',
            type: Type.NOMINAL
          }]
        },
        nest: [{groupBy: ENCODING}, {groupBy: TRANSPOSE}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items;
      assert.equal(groups.length, 2);
      assert.equal((groups[0] as SpecQueryModelGroup).name, 'style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[0] as SpecQueryModelGroup).items.forEach((item: SpecQueryModelGroup) => {
        return !contains([Mark.BAR, Mark.AREA], (item.items[0] as SpecQueryModel).getMark());
      });

      assert.equal((groups[1] as SpecQueryModelGroup).name, 'stack={field:sum(Q),by:N,offset:zero}|style:N1,n|xy:N,n|xy:sum(Q,q)');
      (groups[1] as SpecQueryModelGroup).items.forEach((item: SpecQueryModelGroup) => {
        return contains([Mark.BAR, Mark.AREA], (item.items[0] as SpecQueryModel).getMark());
      });
    });
  });

  describe('encoding/transpose', () => {
    [ENCODING, TRANSPOSE].forEach((groupBy) => {
        it(groupBy + ' should group transposed visualizations', () => {
        const query: Query = {
          spec: {
            mark: SHORT_WILDCARD,
            encodings: [{
              channel: {enum: [Channel.X, Channel.Y]},
              field: 'Q',
              type: Type.QUANTITATIVE
            }, {
              channel: {enum: [Channel.X, Channel.Y]},
              field: 'Q2',
              type: Type.QUANTITATIVE
            }]
          },
          nest: [{groupBy: groupBy}],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema);
        const groups = nest(answerSet, query.nest).items;
        assert.equal(groups.length, 1);
      });

      it(groupBy + ' should group transposed facets visualizations', () => {
        const query: Query = {
          spec: {
            mark: SHORT_WILDCARD,
            encodings: [{
              channel: Channel.X,
              field: 'Q',
              type: Type.QUANTITATIVE
            }, {
              channel: Channel.Y,
              field: 'Q1',
              type: Type.QUANTITATIVE
            }, {
              channel: {enum: [Channel.ROW, Channel.COLUMN]},
              field: 'O',
              type: Type.ORDINAL
            }, {
              channel: {enum: [Channel.ROW, Channel.COLUMN]},
              field: 'N',
              type: Type.NOMINAL
            }]
          },
          nest: [{groupBy: groupBy}],
          config: DEFAULT_QUERY_CONFIG
        };

        const answerSet = generate(query.spec, schema);
        const groups = nest(answerSet, query.nest).items;
        assert.equal(groups.length, 1);
      });


      it(groupBy + ' should not group visualizations that map same variable to y and color', () => {
        const query: Query = {
          spec: {
            mark: Mark.POINT,
            encodings: [{
              channel: Channel.X,
              field: 'Q',
              type: Type.QUANTITATIVE
            }, {
              channel: {enum: [Channel.Y, Channel.COLOR]},
              field: 'Q1',
              type: Type.QUANTITATIVE
            }]
          },
          nest: [{groupBy: groupBy}],
          config: extend({}, DEFAULT_QUERY_CONFIG, {omitNonPositionalOrFacetOverPositionalChannels: false})
        };

        const answerSet = generate(query.spec, schema, query.config);
        const groups = nest(answerSet, query.nest).items;
        assert.equal(groups.length, 2);
      });
    });
  });

  describe('fieldTransform, encoding', () => {
    it('should group visualization with same fields and transformations, then by encoding', () => {
      const query: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [{
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'Q',
            type: Type.QUANTITATIVE,
            aggregate: {
              name: 'a0',
              enum: ['mean', 'median']
            }
          }, {
            channel: {enum: [Channel.X, Channel.Y]},
            field: 'O',
            type: Type.ORDINAL
          }]
        },
        nest: [{groupBy: FIELD_TRANSFORM}, {groupBy: ENCODING}],
        config: DEFAULT_QUERY_CONFIG
      };

      const answerSet = generate(query.spec, schema);
      const groups = nest(answerSet, query.nest).items as SpecQueryModelGroup[];

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
