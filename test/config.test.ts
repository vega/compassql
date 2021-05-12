import {assert} from 'chai';

import {extendConfig, DEFAULT_QUERY_CONFIG} from '../src/config';

describe('config', () => {
  describe('extendConfig', () => {
    const extendedOpt = extendConfig({
      verbose: true,
      enum: {
        mark: ['point'],
        binProps: {
          maxbins: [100, 200]
        }
      }
    });

    it('should preserve default config for ones not overridden.', () => {
      assert.equal(extendedOpt.autoAddCount, DEFAULT_QUERY_CONFIG.autoAddCount);
    });

    it('should successfully override top-level config without changing the default', () => {
      assert.equal(extendedOpt.verbose, true);
      assert.notEqual(extendedOpt.verbose, DEFAULT_QUERY_CONFIG.verbose);
    });

    it('should successfully override top-level enum config without changing the default', () => {
      assert.deepEqual(extendedOpt.enum.mark, ['point']);
      assert.notDeepEqual(extendedOpt.enum.mark, DEFAULT_QUERY_CONFIG.enum.mark);
    });

    it('should successfully override nested enum config without changing the default', () => {
      assert.deepEqual(extendedOpt.enum.binProps.maxbins, [100, 200]);
      assert.notDeepEqual(extendedOpt.enum.binProps.maxbins, DEFAULT_QUERY_CONFIG.enum.binProps.maxbins);
    });
  });
});
