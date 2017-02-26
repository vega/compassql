import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';
import {assert} from 'chai';
import {normalize, Query} from '../../src/query/query';

describe('query/query', () => {
  describe('normalize', () => {
    it('should correctly normalize query', () => {
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        groupBy: 'fieldTransform',
        chooseBy: 'effectiveness',
        orderBy: 'effectiveness',
        config: {}
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        nest: [{
          groupBy: 'fieldTransform',
          orderGroupBy: 'effectiveness'
        }],
        chooseBy: 'effectiveness',
        config: {}
      });
    });

    it('should correctly normalize query with only spec', () => {
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        }
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        }
      });
    });
  });
});
