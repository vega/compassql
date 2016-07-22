import {assert} from 'chai';

import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from './fixture';
import {nest} from '../src/nest';

import {DEFAULT_QUERY_CONFIG} from '../src/config';
import {SpecQueryModel} from '../src/model';
import {SpecQueryModelGroup, isSpecQueryModelGroup} from '../src/modelgroup';
import {Query} from '../src/query/query';

describe('modelgroup', () => {
  describe('isSpecQueryModelGroup', () => {
    it('should return true for a SpecQueryModelGroup', () => {
      const specQ = [
        SpecQueryModel.build({
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        }, schema, DEFAULT_QUERY_CONFIG)
      ];
      const q: Query = {
        spec: {
          mark: Mark.POINT,
          encodings: [
            {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
          ]
        },
        orderBy: 'effectiveness',
      };
      const group: SpecQueryModelGroup = nest(specQ, q);

      assert.isTrue(isSpecQueryModelGroup(group));
    });
    it('should return false for a SpecQueryModel', () => {
      const specM = SpecQueryModel.build({
        mark: Mark.POINT,
        encodings: [
          {channel: Channel.X, field: '*', type: Type.QUANTITATIVE}
        ]
      }, schema, DEFAULT_QUERY_CONFIG);

      assert.isFalse(isSpecQueryModelGroup(specM));
    });
  });
});
