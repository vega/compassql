import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import * as TYPE from 'vega-lite/build/src/type';
import {normalize} from '../../src/query';
import {Query} from '../../src/query/query';

describe('query', () => {
  describe('normalize', () => {
    it('should correctly normalize query', () => {
      const q: Query = {
        spec: {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE}]
        },
        groupBy: 'fieldTransform',
        chooseBy: 'effectiveness',
        orderBy: 'effectiveness'
      };

      assert.deepEqual(normalize(q), {
        spec: {
          mark: MARK.POINT,
          encodings: [{channel: CHANNEL.X, field: '*', type: TYPE.QUANTITATIVE}]
        },
        nest: [
          {
            groupBy: 'fieldTransform',
            orderGroupBy: 'effectiveness'
          }
        ],
        chooseBy: 'effectiveness'
      });
    });
  });
});
