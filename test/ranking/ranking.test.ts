import {Channel} from 'vega-lite/src/channel';
import {Type} from 'vega-lite/src/type';

import {schema} from '../fixture';
import {rank} from '../../src/ranking/ranking';

import {SpecQueryModelGroup} from '../../src/modelgroup';

import {assert} from 'chai';


describe('ranking', () => {
  describe('rank', () => {
    describe('group.items', () => {
      let group: SpecQueryModelGroup =
        rank(
          {name: '', path: '', items: []},
          { spec: {
              data: {url: 'data/cars.json'},
              mark: '?',
              encodings: [
                {channel: Channel.Y, field: 'Cylinders', type: Type.ORDINAL},
                {field: 'Name', type: Type.NOMINAL, channel: '?'}
              ]
            },
          },
          schema,
          0
        );

      it('should be an empty array if the answerSet is empty', () => {
        assert.deepEqual(group.items, []);
      });
    });
  });
});
