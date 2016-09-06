import {AggregateOp} from 'vega-lite/src/aggregate';
import {AxisOrient} from 'vega-lite/src/axis';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {SortOrder} from 'vega-lite/src/sort';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {SHORT_ENUM_SPEC} from '../../src/enumspec';
import {parse, splitWithTail, shorthandParser, vlSpec, spec as specShorthand, encoding as encodingShorthand, fieldDef as fieldDefShorthand, calculate as calculateShorthand, INCLUDE_ALL, getReplacer} from '../../src/query/shorthand';
import {extend} from '../../src/util';
import {REPLACE_BLANK_FIELDS} from '../../src/query/groupby';
import {EncodingQuery} from '../../src/query/encoding';
import {SpecQuery} from '../../src/query/spec';

import {assert} from 'chai';

describe('query/shorthand', () => {
  describe('vlSpec', () => {
    it('should return a proper short hand string for a vega-lite spec', () => {
      assert.equal(vlSpec({
        transform: {
          filter: 'datum.x === 5',
          calculate: [{
            field: 'x2',
            expr: 'datum.x*2'
          }]
        },
        mark: Mark.POINT,
        encoding: {
          x: {field: 'x', type: Type.QUANTITATIVE}
        }
      }), 'point|calculate:{x2:datum.x*2}|filter:"datum.x === 5"|x:x,q');
    });
  });

  describe('splitWithTail', () => {
    it('should correctly split a string', () => {
      let result = splitWithTail('012-345-678-9', '-', 2);
      assert.deepEqual(result, ['012', '345', '678-9']);
    });

    it('should correctly split a string when `count` is greater than the number of delimiters in the string', () => {
      let result = splitWithTail('012-345', '-', 3);
      assert.deepEqual(result, ['012', '345', '', '']);
    });
  });

  describe('parse', () => {
    it('should correctly parse a shorthand string with calculate, filter, and filterInvalid', () => {
      let specQ: SpecQuery = parse(
        'point|calculate:{b2:3*datum["b2"]}|filter:"datum[\\"b2\\"] > 60"|filterInvalid:false|x:b2,q|y:bin(balance,q)'
      );

      assert.deepEqual(specQ, {
        transform: {
          calculate: [{field: 'b2', expr: '3*datum["b2"]'}],
          filter: 'datum["b2"] > 60',
          filterInvalid: false
        },
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'b2', type: Type.QUANTITATIVE},
          {bin: {}, channel: Channel.Y, field: 'balance', type: Type.QUANTITATIVE}
        ]
      });
    });

    it('should correctly parse an ambiguous shorthand with aggregate, bin as enum spec, and with hasFn', () => {
      let specQ: SpecQuery = parse('?|?:?{"aggregate":"?","bin":"?","hasFn":true}(?,?)');

      assert.equal(specQ.mark, '?');
      assert.deepEqual(specQ.encodings[0], {
        aggregate: '?',
        bin: '?',
        channel: '?',
        field: '?',
        hasFn: true,
        type: '?'
      });
    });

    it('should correctly parse an ambiguous shorthand with aggregate and bin as enum spec', () => {
      let specQ: SpecQuery = parse('?|?:?{"aggregate":["max","min"],"bin":[false,true],"hasFn":true}(?,?)');

      assert.equal(specQ.mark, '?');
      assert.deepEqual(specQ.encodings[0], {
        aggregate: {enum: ['max', 'min']},
        bin: {enum: [false, true]},
        channel: '?',
        field: '?',
        hasFn: true,
        type: '?'
      });
    });
  });

  describe('shorthandParser', () => {
    describe('encoding', () => {
      it('should correctly parse an encoding query given a channel and fieldDefShorthand', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;

        encQ = shorthandParser.encoding(
          'x',
          'bin(a,q,maxbins=20,scale={"type":"linear"})'
        );

        assert.deepEqual(encQ, {
          bin: {maxbins: 20},
          channel: Channel.X,
          field: 'a',
          type: Type.QUANTITATIVE,
          scale: {type: ScaleType.LINEAR},
        });
      });
    });

    describe('fn', () => {
      it('should correctly parse an encoding query given a fieldDefShorthand with aggregation function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'sum(horsepower,q)');
        assert.deepEqual(encQ, {aggregate: AggregateOp.SUM, field: 'horsepower', type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with count function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'count(*,q)');
        assert.deepEqual(encQ,{aggregate: AggregateOp.COUNT, field: '*', type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with timeunit function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'hours(a,t)');
        assert.deepEqual(encQ, {field: 'a', timeUnit: TimeUnit.HOURS, type: Type.TEMPORAL});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,maxbins=20)');
        assert.deepEqual(encQ, {
          bin: {maxbins: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });
    });

    describe('rawFieldDef', () => {
      it('should correctly parse an encoding query from fieldDef parts', () => {
        let encQ = shorthandParser.rawFieldDef({} as EncodingQuery,
          splitWithTail('a,q,scale={"domain":[1,2],"exponent":3,"type":"pow"},axis={"orient":"top"}', ',', 2)
        );
        assert.deepEqual(encQ, {axis: {orient: AxisOrient.TOP}, field: 'a', scale: {domain: [1, 2], exponent: 3, type: ScaleType.POW}, type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query from fieldDef parts', () => {
        let encQ = shorthandParser.rawFieldDef({} as EncodingQuery,
          splitWithTail('a,n,sort={"field":"a","op":"mean","order":"descending"}', ',', 2)
        );
        assert.deepEqual(encQ, {field: 'a', sort: {field: 'a', op: AggregateOp.MEAN, order: SortOrder.DESCENDING}, type: Type.NOMINAL});
      });
    });
  });

  describe('spec', () => {
    it('should return correct spec string for specific specQuery', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });

    it('should exclude autoCount:false mapping', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE},
          {channel: Channel.Y, autoCount: false, type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });

    it('should return correct spec string for specific specQuery with channel replacer', () => {
      const str = specShorthand({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE},
            {channel: Channel.COLOR, field: 'b', type: Type.QUANTITATIVE}
          ]
        },
        INCLUDE_ALL,
        {
          channel: (channel: any) => {
            if (channel === Channel.X || channel === Channel.Y) {
              return 'xy';
            }
            return channel;
          }
        }
      );
      assert.equal(str, 'point|color:b,q|xy:a,q');
    });

    it('should return correct spec string for specific specQuery when mark is not included.', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      }, {channel: true, field: true, type: true});
      assert.equal(str, 'x:a,q');
    });

    it('should return correct spec string for a histogram with autoCount=true when groupBy field with blank replacer.', () => {
      const str = specShorthand({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, bin: true, field: 'a', type: Type.QUANTITATIVE},
          {channel: Channel.Y, autoCount: true, type: Type.QUANTITATIVE}
        ]
      }, { // include
        field: true
      }, { // replacer
        field: getReplacer(REPLACE_BLANK_FIELDS)
      });
      assert.equal(str, 'a');
    });

    it('should return correct spec string for ambiguous specQuery', () => {
      const str = specShorthand({
        mark: SHORT_ENUM_SPEC,
        encodings: [
          {channel: SHORT_ENUM_SPEC, field: SHORT_ENUM_SPEC, type: SHORT_ENUM_SPEC, aggregate: SHORT_ENUM_SPEC, bin: SHORT_ENUM_SPEC}
        ]
      });
      assert.equal(str, '?|?:?{"aggregate":"?","bin":"?"}(?,?)');
    });

    it('should return correct spec string for a specific specQuery with transform filter and calculate', () => {
      const str = specShorthand({
        transform: {
          calculate: [{field: 'b2', expr: '3*datum["b2"]'}],
          filter: 'datum["b2"] > 60',
          filterInvalid: false
        },
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'b2', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|calculate:{b2:3*datum["b2"]}|filter:"datum[\\"b2\\"] > 60"|filterInvalid:false|x:b2,q');
    });

    it('should return correct spec string for a specific specQuery with transform filter and calculate', () => {
      const str = specShorthand({
        transform: {
          filter: [
            {field: 'color', equal: 'red'}, 'datum["b2"] > 60', {field: 'color', oneOf: ['red', 'yellow']}, {field: 'x', range: [0,5]}
          ],
          filterInvalid: false
        },
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'b2', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|filter:[{"field":"color","equal":"red"},"datum[\\"b2\\"] > 60",{"field":"color","oneOf":["red","yellow"]},{"field":"x","range":[0,5]}]|filterInvalid:false|x:b2,q');
    });

    it('should return correct spec string for a specific specQuery with an empty transform', () => {
      const str = specShorthand({
        transform: {},
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|x:a,q');
    });
  });

  describe('calculate', () => {
    it('should return a correct calculate string when passed a Formula array', () => {
      const str = calculateShorthand([
        {field: 'b2', expr: '2*datum["b"]'}, {field: 'a', expr:'3*datum["a"]'}
      ]);
      assert.equal(str, '{b2:2*datum["b"]},{a:3*datum["a"]}');
    });
  });

  describe('stack', () => {
    it('should include stack for stacked specQuery by default', () => {
      const str = specShorthand({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'q', type: Type.QUANTITATIVE, aggregate: AggregateOp.SUM},
          {channel: Channel.Y, field: 'n', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'n1', type: Type.NOMINAL}
        ]
      });
      assert.equal(str, 'bar|stack={field:sum(q),by:n,offset:zero}|color:n1,n|x:sum(q,q)|y:n,n');
    });

    it('should exclude stack for stacked specQuery if we exclude it', () => {
      const str = specShorthand({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'q', type: Type.QUANTITATIVE, aggregate: AggregateOp.SUM},
          {channel: Channel.Y, field: 'n', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'n1', type: Type.NOMINAL}
        ]
      }, extend({}, INCLUDE_ALL, {stack: false}));
      assert.equal(str, 'bar|color:n1,n|x:sum(q,q)|y:n,n');
    });
  });

  describe('encoding', () => {
    it('should return correct encoding string for raw field', () => {
       const str = encodingShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'x:a,q');
    });

    it('should return correct encoding string for raw field when channel is not included', () => {
       const str = encodingShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE
       }, {
         field: true, type: true
       });
       assert.equal(str, 'a,q');
    });
  });

  describe('fieldDef', () => {
    it('should return - for disabled autocount field', () => {
       const str = fieldDefShorthand({channel: Channel.X, autoCount: false});
       assert.equal(str, '-');
    });

    it('should return correct fieldDefShorthand string for raw field', () => {
       const str = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for raw field when nothing is included', () => {
       const str = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}, {});
       assert.equal(str, '...');
    });

    it('should return correct fieldDefShorthand string for aggregate field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       });
       assert.equal(str, 'mean(a,q)');
    });

    it('should not include aggregate string for aggregate field when aggregate is not included', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: AggregateOp.MEAN
       }, {field: true, type: true});
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: SHORT_ENUM_SPEC,
         bin: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?{"aggregate":"?","bin":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: {name: 'a1', enum: [AggregateOp.MAX, AggregateOp.MIN]},
         bin: {enum:[false, true], maxbins:20}
       });
       assert.equal(str, '?{"aggregate":["max","min"],"bin":[false,true]}(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: {name: 'a1', enum: [undefined, AggregateOp.MIN]},
         bin: {enum:[false, true], maxbins:20},
         hasFn: true
       });
       assert.equal(str, '?{"aggregate":[null,"min"],"bin":[false,true],"hasFn":true}(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for timeunit field', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.TEMPORAL, timeUnit: TimeUnit.HOURS
        });
      assert.equal(str, 'hours(a,t)');
    });

    it('should return correct fieldDefShorthand string for ambiguous timeunit field', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: SHORT_ENUM_SPEC
        });
      assert.equal(str, '?{"timeUnit":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for sort with ascending', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, sort: SortOrder.ASCENDING
      });
      assert.equal(str, 'a,q,sort="ascending"');
    });

    it('should return correct fieldDefShorthand string for sort field definition object', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, sort: {field: 'a', op: AggregateOp.MEAN, order: SortOrder.DESCENDING}
      });
      assert.equal(str, 'a,q,sort={"field":"a","op":"mean","order":"descending"}');
    });

    it('should return correct fieldDefShorthand string for bin with maxbins, and scale with scaleType ', () => {
      const str = fieldDefShorthand({
        bin: {maxbins: 20}, channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LINEAR}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"})');
    });

    it('should return correct fieldDefShorthand string for scale with scaleType ordinal and sort field definition object', () => {
      const str = fieldDefShorthand({
        channel: Channel.Y, field: 'a', type: Type.ORDINAL, scale: {type: ScaleType.ORDINAL}, sort: {op: AggregateOp.MEAN, field: 'b'}
      });
      assert.equal(str, 'a,o,scale={"type":"ordinal"},sort={"field":"b","op":"mean"}');
    });

    it('should return correct fieldDefShorthand string for bin with maxbins, axis with orient, scale with scaleType ', () => {
      const str = fieldDefShorthand({
        axis: {orient: AxisOrient.TOP}, bin: {maxbins: 20}, channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LINEAR}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"},axis={"orient":"top"})');
    });

    it('should return correct fieldDefShorthand string for axis with orient, shortTimeLabels, ticks, and title', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.X,
            field: 'a',
            type: Type.QUANTITATIVE,
            axis: {orient: AxisOrient.TOP, shortTimeLabels: true, ticks: 5, title: 'test x channel'}
          }
        ]
      });
      assert.equal(str, 'point|x:a,q,axis={"orient":"top","shortTimeLabels":true,"ticks":5,"title":"test x channel"}');
    });

    it('should return correct fieldDefShorthand string for legend with orient, labelAlign, symbolSize, and title', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.COLOR,
            field: 'a',
            type: Type.NOMINAL,
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ]
      });
      assert.equal(str, 'point|color:a,n,legend={"orient":"right","labelAlign":"left","symbolSize":12,"title":"test title"}');
    });

    it('should return a fieldDefShorthand string without incorrect legend', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            axis: {orient: AxisOrient.RIGHT},
            channel: Channel.X,
            field: 'a',
            type: Type.NOMINAL,
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ]
      });
      assert.equal(str, 'point|x:a,n,axis={"orient":"right"}');
    });

    it('should return a fieldDefShorthand string without incorrect axis', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            axis: {orient: AxisOrient.RIGHT},
            channel: Channel.COLOR,
            field: 'a',
            type: Type.NOMINAL,
            legend: {labelAlign: 'left'}
          }
        ]
      });
      assert.equal(str, 'point|color:a,n,legend={"labelAlign":"left"}');
    });

    it('should return correct fieldDefShorthand string for scale with a string[] domain', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.NOMINAL, scale: {domain: ['cats', 'dogs']}
      });
      assert.equal(str, 'a,n,scale={"domain":["cats","dogs"]}');
    });

    it('should return correct fieldDefShorthand string for scale with a number[] domain', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.NOMINAL, scale: {domain: [1,2]}
      });
      assert.equal(str, 'a,n,scale={"domain":[1,2]}');
    });

    it('should return correct fieldDefShorthand string for scale with a string[] range', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.NOMINAL, scale: {range: ['cats', 'dogs']}
      });
      assert.equal(str, 'a,n,scale={"range":["cats","dogs"]}');
    });

    it('should return correct fieldDefShorthand string for scale with a number[] range', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.NOMINAL, scale: {range: [1,2]}
      });
      assert.equal(str, 'a,n,scale={"range":[1,2]}');
    });

    it('should return correct fieldDefShorthand string for bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: true
       });
       assert.equal(str, 'bin(a,q)');
    });


    it('should return correct fieldDefShorthand string for bin field with maxbins', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}
       });
       assert.equal(str, 'bin(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType linear', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LINEAR}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"})');
    });

    it('should return correct fieldDefShorthand string for bin field with maxbins and scale with scaleType linear when only field, bin, and type are included', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {maxbins: 20}, scale: {type: ScaleType.LINEAR}
      }, {field: true, bin: true, type: true});
      assert.equal(str, 'bin(a,q)');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: null
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for disabled scale', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: false
      });
      assert.equal(str, 'a,q,scale=false');
    });

    it('should return correct fieldDefShorthand string for empty scale definition', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {}
      });
      assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for scale with scaleType log', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LOG}
       });
       assert.equal(str, 'a,q,scale={"type":"log"}');
    });

    it('should return correct fieldDef string for scale with clamp=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {clamp: true}
      });
      assert.equal(str, 'a,q,scale={"clamp":true}');
    });

    it('should return correct fieldDef string for scale with round=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {round: true}
      });
      assert.equal(str, 'a,q,scale={"round":true}');
    });

    it('should return correct fieldDef string for scale with exponent of 3 and supported scaleType', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.POW, exponent: 3}
       });
       assert.equal(str, 'a,q,scale={"exponent":3,"type":"pow"}');
    });

    it('should return correct fieldDef string for scale with nice=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {nice: true}
      });
      assert.equal(str, 'a,q,scale={"nice":true}');
    });

    it('should return correct fieldDef string for scale with round=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {round: true}
      });
      assert.equal(str, 'a,q,scale={"round":true}');
    });

    it('should return correct fieldDef string for scale with zero=true', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {zero: true}
      });
      assert.equal(str, 'a,q,scale={"zero":true}');
    });

    // TODO: Update tests for other scale.*

    it('should return correct fieldDefShorthand string for ambiguous bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?{"bin":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: SHORT_ENUM_SPEC, type: Type.QUANTITATIVE
       });
       assert.equal(str, '?,q');
    });

    it('should return correct fieldDefShorthand string for autocount field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, autoCount: true
       });
       assert.equal(str, 'count(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous autocount field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, autoCount: SHORT_ENUM_SPEC
       });
       assert.equal(str, '?{"autoCount":"?"}(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous type', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: SHORT_ENUM_SPEC
       });
       assert.equal(str, 'a,?');
    });
  });
});
