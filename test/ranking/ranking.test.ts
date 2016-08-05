import {Channel} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';


import {schema} from '../fixture';
import {rank} from '../../src/ranking/ranking';

import {SpecQueryModelGroup} from '../../src/modelgroup';

import {assert} from 'chai';


describe('ranking', () => {
  describe('rank', () => {
    let group: SpecQueryModelGroup =
      rank(
        {name: '', path: '', items: []},
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

    it('should return an empty group if the input group is empty', () => {
      assert.deepEqual(group.items, []);
    });
  });
});
