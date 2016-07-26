import {assert} from 'chai';
import {initEnumSpec} from '../src/enumspec';

describe('enumspec', () => {
  describe('initEnumSpec', () => {
    it('should return full enumSpec with other properties preserved', () => {
      const binQuery = initEnumSpec({values: [true, false], maxbins: 30}, 'b1', [true, false]);
      assert.deepEqual(binQuery.values, [true, false]);
      assert.equal(binQuery.maxbins, 30);
      assert.equal(binQuery.name, 'b1');
    });
  });
});
