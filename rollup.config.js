import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'build/src/index.js',
  output: {
    file: 'build/compassql.js',
    format: 'umd',
    sourcemap: true,
    name: 'cql'
  },
  plugins: [
    nodeResolve(),
    json(),
    commonjs({
      namedExports: {
        'datalib/src/util': [
          'isArray',
          'cmp',
          'keys',
          'duplicate',
          'extend',
          'isObject',
          'isBoolean',
          'toMap',
          'isString'
        ],
        'datalib/src/stats.js': ['summary'],
        'datalib/src/import/type': ['inferAll']
      }
    }),
    sourcemaps()
  ]
};
