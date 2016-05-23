import {assert} from 'chai';
import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {ENUMERATOR_INDEX} from '../src/generate';
import {SpecQueryModel} from '../src/model';
import {DEFAULT_QUERY_CONFIG, SpecQuery} from '../src/query';
import {Schema} from '../src/schema';
import {extend} from '../src/util';


describe('generate', function () {
  const schema = new Schema([]);

  function buildSpecQueryModel(specQ: SpecQuery) {
    return SpecQueryModel.build(specQ, schema, DEFAULT_QUERY_CONFIG);
  }

  describe('mark', () => {
    it('should correctly enumerate marks', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.Y, field: 'A', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX['mark'](specQ.enumSpecIndex, schema, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 2);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
      assert.equal(answerSet[1].getMark(), Mark.BAR);
    });

    it('should not enumerate invalid mark', () => {
      const specQ = buildSpecQueryModel({
        mark: {enumValues: [Mark.POINT, Mark.BAR, Mark.LINE, Mark.AREA]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE},
          {channel: Channel.SHAPE, field: 'A', type: Type.ORDINAL}
        ]
      });
      const enumerator = ENUMERATOR_INDEX['mark'](specQ.enumSpecIndex, schema, DEFAULT_QUERY_CONFIG);

      const answerSet = enumerator([], specQ);
      assert.equal(answerSet.length, 1);
      assert.equal(answerSet[0].getMark(), Mark.POINT);
    });
  });

  describe('encoding', () => {
    describe('channel', () => {
      it('should correctly enumerate channels', () => {
        const specQ = buildSpecQueryModel({
          mark: Mark.POINT,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.Y]},
              field: 'A',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX['channel'](specQ.enumSpecIndex, schema, extend({}, DEFAULT_QUERY_CONFIG, {omitVerticalDotPlot: false}));

        const answerSet = enumerator([], specQ);
        assert.equal(answerSet.length, 2);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
        assert.equal(answerSet[1].getEncodingQueryByIndex(0).channel, Channel.Y);
      });

      it('should not enumerate invalid channels', () => {
        const specQ = buildSpecQueryModel({
          mark: Mark.BAR,
          encodings: [
            {
              channel: {enumValues: [Channel.X, Channel.SHAPE]},
              field: 'A',
              type: Type.QUANTITATIVE
            }
          ]
        });
        const enumerator = ENUMERATOR_INDEX['channel'](specQ.enumSpecIndex, schema, DEFAULT_QUERY_CONFIG);

        const answerSet = enumerator([], specQ);
        assert.equal(answerSet.length, 1);
        assert.equal(answerSet[0].getEncodingQueryByIndex(0).channel, Channel.X);
      });
    });
  });
});
