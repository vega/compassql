

import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {TimeUnit} from 'vega-lite/src/timeunit';
import {Type} from 'vega-lite/src/type';

import {PropIndex} from '../../src/propindex';
import {SHORT_WILDCARD} from '../../src/wildcard';
import {
  parse, splitWithTail, shorthandParser, vlSpec, spec as specShorthand,
  encoding as encodingShorthand, fieldDef as fieldDefShorthand, calculate as calculateShorthand,
  INCLUDE_ALL, getReplacer, Replacer
} from '../../src/query/shorthand';

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
            as: 'x2',
            expr: 'datum.x*2'
          }]
        },
        mark: Mark.POINT,
        encoding: {
          x: {field: 'x', type: Type.QUANTITATIVE}
        }
      }), 'point|calculate:{"x2":"datum.x*2"}|filter:"datum.x === 5"|x:x,q');
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
        'point|calculate:{"b2":"3*datum[\\"b2\\"]","a3":"3*datum[\\"a3\\"]"}|filter:"datum[\\"b2\\"] > 60"|filterInvalid:false|x:b2,q|y:bin(balance,q)'
      );

      assert.deepEqual(specQ, {
        transform: {
          calculate: [{as: 'b2', expr: '3*datum["b2"]'}, {as: 'a3', expr: '3*datum["a3"]'}],
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

    it('should correctly parse an ambiguous shorthand with aggregate, bin as wildcard, and with hasFn', () => {
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

    it('should correctly parse an ambiguous shorthand with aggregate and bin as wildcard', () => {
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
        assert.deepEqual(encQ, {aggregate: 'sum', field: 'horsepower', type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with count function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'count(*,q)');
        assert.deepEqual(encQ,{aggregate: 'count', field: '*', type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with timeunit function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'hours(a,t)');
        assert.deepEqual(encQ, {field: 'a', timeUnit: TimeUnit.HOURS, type: Type.TEMPORAL});
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with maxbins bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,maxbins=20)');
        assert.deepEqual(encQ, {
          bin: {maxbins: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with min bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,min=20)');
        assert.deepEqual(encQ, {
          bin: {min: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with max bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,max=20)');
        assert.deepEqual(encQ, {
          bin: {max: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with base bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,base=20)');
        assert.deepEqual(encQ, {
          bin: {base: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with step bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,step=20)');
        assert.deepEqual(encQ, {
          bin: {step: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with steps bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,steps=[2,5])');
        assert.deepEqual(encQ, {
          bin: {steps: [2, 5]},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with minstep bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,minstep=20)');
        assert.deepEqual(encQ, {
          bin: {minstep: 20},
          field: 'a',
          type: Type.QUANTITATIVE,
        });
      });

      it('should correctly parse an encoding query given a fieldDefShorthand with div bin function', () => {
        let encQ: EncodingQuery = {} as EncodingQuery;
        shorthandParser.fn(encQ, 'bin(a,q,div=[5,2])');
        assert.deepEqual(encQ, {
          bin: {div: [5, 2]},
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
        assert.deepEqual(encQ, {axis: {orient: 'top'}, field: 'a', scale: {domain: [1, 2], exponent: 3, type: ScaleType.POW}, type: Type.QUANTITATIVE});
      });

      it('should correctly parse an encoding query from fieldDef parts', () => {
        let encQ = shorthandParser.rawFieldDef({} as EncodingQuery,
          splitWithTail('a,n,sort={"field":"a","op":"mean","order":"descending"}', ',', 2)
        );
        assert.deepEqual(encQ, {field: 'a', sort: {field: 'a', op: 'mean', order: 'descending'}, type: Type.NOMINAL});
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
        new PropIndex<Replacer>({
          channel: (channel: any) => {
            if (channel === Channel.X || channel === Channel.Y) {
              return 'xy';
            }
            return channel;
          }
        })
      );
      assert.equal(str, 'point|color:b,q|xy:a,q');
    });

    it('should return correct spec string for specific specQuery when mark is not included.', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}
        ]
      }, new PropIndex<boolean>({channel: true, field: true, type: true}));
      assert.equal(str, 'x:a,q');
    });

    it('should return correct spec string for a histogram with autoCount=true when groupBy field with blank replacer.', () => {
      const str = specShorthand({
          mark: Mark.BAR,
          encodings: [
            {channel: Channel.X, bin: true, field: 'a', type: Type.QUANTITATIVE},
            {channel: Channel.Y, autoCount: true, type: Type.QUANTITATIVE}
          ]
        },
        new PropIndex<boolean>({field: true}), new PropIndex<Replacer>({ // replacer
          field: getReplacer(REPLACE_BLANK_FIELDS)
        })
      );
      assert.equal(str, 'a');
    });

    it('should return correct spec string for ambiguous mark, channel, field, and type', () => {
      const str = specShorthand({
        mark: {enum: [Mark.POINT, Mark.TICK]},
        encodings: [
          {
            channel: {name: 'c1', enum: [Channel.X, Channel.Y]},
            field: {enum: ['field1', 'field2']},
            type: {enum: [Type.NOMINAL, Type.ORDINAL]},
            aggregate: SHORT_WILDCARD,
            bin: SHORT_WILDCARD
          }
        ]
      });

      assert.equal(str, '?["point","tick"]|?["x","y"]:?{"aggregate":"?","bin":"?"}(?["field1","field2"],?["nominal","ordinal"])');
    });

    it('should return correct spec string for ambiguous specQuery', () => {
      const str = specShorthand({
        mark: SHORT_WILDCARD,
        encodings: [
          {channel: SHORT_WILDCARD, field: SHORT_WILDCARD, type: SHORT_WILDCARD, aggregate: SHORT_WILDCARD, bin: SHORT_WILDCARD}
        ]
      });
      assert.equal(str, '?|?:?{"aggregate":"?","bin":"?"}(?,?)');
    });

    it('should return correct spec string for a specific specQuery with transform filter and calculate', () => {
      const str = specShorthand({
        transform: {
          calculate: [{as: 'b2', expr: '3*datum["b2"]'}],
          filter: 'datum["b2"] > 60',
          filterInvalid: false
        },
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: 'b2', type: Type.QUANTITATIVE}
        ]
      });
      assert.equal(str, 'point|calculate:{"b2":"3*datum[\\"b2\\"]"}|filter:"datum[\\"b2\\"] > 60"|filterInvalid:false|x:b2,q');
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
        {as: 'b2', expr: '2*datum["b"]'}, {as: 'a', expr:'3*datum["a"]'}
      ]);
      assert.equal(str, '{"b2":"2*datum[\\"b\\"]","a":"3*datum[\\"a\\"]"}');
    });
  });

  describe('stack', () => {
    it('should include stack for stacked specQuery by default', () => {
      const str = specShorthand({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'q', type: Type.QUANTITATIVE, aggregate: 'sum'},
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
          {channel: Channel.X, field: 'q', type: Type.QUANTITATIVE, aggregate: 'sum'},
          {channel: Channel.Y, field: 'n', type: Type.NOMINAL},
          {channel: Channel.COLOR, field: 'n1', type: Type.NOMINAL}
        ]
      }, INCLUDE_ALL.duplicate().set('stack', false));
      assert.equal(str, 'bar|color:n1,n|x:sum(q,q)|y:n,n');
    });
  });

  describe('encoding', () => {
    it('should return correct encoding string for raw field', () => {
       const str = encodingShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE});
       assert.equal(str, 'x:a,q');
    });

    it('should return correct encoding string for channel as short wildcard', () => {
      const str = encodingShorthand({channel: '?', field: 'a', type: Type.QUANTITATIVE});
      assert.equal(str, '?:a,q');
    });

    it('should return correct encoding string for bin with maxbins as wildcard and channel as wildcard', () => {
      const str = encodingShorthand({bin: {maxbins: {enum: [10, 20]}}, channel: {enum: [Channel.X, Channel.Y]}, field: 'a', type: Type.QUANTITATIVE});
      assert.equal(str, '?["x","y"]:bin(a,q,maxbins=?[10,20])');
    });

    it('should return correct encoding string for raw field when channel is not included', () => {
       const str = encodingShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE
       }, new PropIndex<boolean>({
         field: true, type: true
       }));
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
       const str = fieldDefShorthand({channel: Channel.X, field: 'a', type: Type.QUANTITATIVE}, new PropIndex<boolean>());
       assert.equal(str, '...');
    });

    it('should return correct fieldDefShorthand string for aggregate field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: 'mean'
       });
       assert.equal(str, 'mean(a,q)');
    });

    it('should not include aggregate string for aggregate field when aggregate is not included', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, aggregate: 'mean'
       }, new PropIndex<boolean>({field: true, type: true}));
       assert.equal(str, 'a,q');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: SHORT_WILDCARD,
         bin: SHORT_WILDCARD
       });
       assert.equal(str, '?{"aggregate":"?","bin":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: {name: 'a1', enum: ['max', 'min']},
         bin: {enum:[false, true], maxbins:20}
       });
       assert.equal(str, '?{"aggregate":["max","min"],"bin":[false,true]}(a,q,maxbins=20)');
    });

    it('should return correct fieldDefShorthand string for ambiguous aggregate/bin field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X,
         field: 'a',
         type: Type.QUANTITATIVE,
         aggregate: {name: 'a1', enum: [undefined, 'min']},
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
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, timeUnit: SHORT_WILDCARD
        });
      assert.equal(str, '?{"timeUnit":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for sort with ascending', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, sort: 'ascending'
      });
      assert.equal(str, 'a,q,sort="ascending"');
    });

    it('should return correct fieldDefShorthand string for sort field definition object', () => {
      const str = fieldDefShorthand({
        channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, sort: {field: 'a', op: 'mean', order: 'descending'}
      });
      assert.equal(str, 'a,q,sort={"field":"a","op":"mean","order":"descending"}');
    });

    it('should return correct fieldDefShorthand string for bin with maxbins, and scale with scaleType ', () => {
      const str = fieldDefShorthand({
        bin: {maxbins: 20}, channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LINEAR}
      });
      assert.equal(str, 'bin(a,q,maxbins=20,scale={"type":"linear"})');
    });

    it('should return correct fieldDefShorthand string for scale with scaleType point and sort field definition object', () => {
      const str = fieldDefShorthand({
        channel: Channel.Y, field: 'a', type: Type.ORDINAL, scale: {type: ScaleType.POINT}, sort: {field: 'b', op: 'mean'}
      });
      assert.equal(str, 'a,o,scale={"type":"point"},sort={"field":"b","op":"mean"}');
    });

    it('should return correct fieldDefShorthand string for bin with maxbins, axis with orient, scale with scaleType ', () => {
      const str = fieldDefShorthand({
        axis: {orient: 'top'}, bin: {maxbins: 20}, channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, scale: {type: ScaleType.LINEAR}
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
            axis: {orient: 'top', ticks: 5, title: 'test x channel'}
          }
        ]
      });
      assert.equal(str, 'point|x:a,q,axis={"orient":"top","ticks":5,"title":"test x channel"}');
    });

    it('should return correct fieldDefShorthand string for legend with properties ordered alphabetically', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            channel: Channel.COLOR,
            field: 'a',
            type: Type.NOMINAL,
            legend: {title: 'test title', orient: 'right',}
          }
        ]
      });
      assert.equal(str, 'point|color:a,n,legend={"orient":"right","title":"test title"}');
    });

    it('should return a fieldDefShorthand string without incorrect legend', () => {
      const str = specShorthand({
        mark: Mark.POINT,
        encodings: [
          {
            axis: {orient: 'right'},
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
            axis: {orient: 'right'},
            channel: Channel.COLOR,
            field: 'a',
            type: Type.NOMINAL,
            legend: {
              zindex: 0
            }
          }
        ]
      });
      assert.equal(str, 'point|color:a,n,legend={"zindex":0}');
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

    it('should return correct fieldDefShorthand string for bin field with min', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {extent: [0, 20]}
       });
       assert.equal(str, 'bin(a,q,extent=[0,20])');
    });

    it('should return correct fieldDefShorthand string for bin field with base', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {base: 20}
       });
       assert.equal(str, 'bin(a,q,base=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with step', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {step: 20}
       });
       assert.equal(str, 'bin(a,q,step=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with steps', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {steps: [2, 5]}
       });
       assert.equal(str, 'bin(a,q,steps=[2,5])');
    });

    it('should return correct fieldDefShorthand string for bin field with minstep', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {minstep: 20}
       });
       assert.equal(str, 'bin(a,q,minstep=20)');
    });

    it('should return correct fieldDefShorthand string for bin field with divide', () => {       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: {divide: [5, 2]}
       });
       assert.equal(str, 'bin(a,q,divide=[5,2])');
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
      }, new PropIndex<boolean>({field: true, bin: true, type: true}));
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
         channel: Channel.X, field: 'a', type: Type.QUANTITATIVE, bin: SHORT_WILDCARD
       });
       assert.equal(str, '?{"bin":"?"}(a,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous field', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: SHORT_WILDCARD, type: Type.QUANTITATIVE
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
         channel: Channel.X, autoCount: SHORT_WILDCARD
       });
       assert.equal(str, '?{"autoCount":"?"}(*,q)');
    });

    it('should return correct fieldDefShorthand string for ambiguous type', () => {
       const str = fieldDefShorthand({
         channel: Channel.X, field: 'a', type: SHORT_WILDCARD
       });
       assert.equal(str, 'a,?');
    });
  });
});
