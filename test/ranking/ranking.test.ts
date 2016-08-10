import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {schema} from '../fixture';

import {SpecQueryModelGroup} from '../../src/model';
import {rank} from '../../src/ranking/ranking';

import {assert} from 'chai';


describe('ranking', () => {
  describe('rank', () => {
    it('should return an empty group if the input group is empty', () => {
      let group: SpecQueryModelGroup = rank(
        new SpecQueryModelGroup(),
        {
          spec: {
            mark: Mark.BAR,
            encodings: [
              {channel: Channel.SHAPE, field: 'N', type: Type.NOMINAL},
            ]
          },
          chooseBy: 'effectiveness'
        },
        schema,
        0
      );
      assert.deepEqual(group.items, []);
    });
  });
});
