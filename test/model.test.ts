import {assert} from 'chai';

import {Mark} from 'vega-lite/src/mark';
import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {SpecQueryModel} from '../src/model';

describe('SpecQueryModel', () => {
  describe('toSpec', () => {
    it('should return a Vega-Lite spec if the query is completed', () => {
      const specQ = new SpecQueryModel({
        mark: Mark.BAR,
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      const spec = specQ.toSpec();
      assert.deepEqual(spec, {
        mark: Mark.BAR,
        encoding: {
          x: {field: 'A', type: Type.QUANTITATIVE}
        }
      });
    });

    it('should return null if the query is incompleted', () => {
      const specQ = new SpecQueryModel({
        mark: {enumValues: [Mark.BAR, Mark.POINT]},
        encodings: [
          {channel: Channel.X, field: 'A', type: Type.QUANTITATIVE}
        ]
      });

      assert.isNull(specQ.toSpec());
    });
  });
});
