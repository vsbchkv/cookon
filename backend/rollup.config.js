import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import terser from '@rollup/plugin-terser';

import typescript from '@rollup/plugin-typescript';
// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === 'production';

function minifyJson() {
  return {
    name: 'minify-json',
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach((fileName) => {
        console.log(fileName);

        if (fileName.endsWith('.json')) {
          const original = bundle[fileName].source.toString();
          const minified = JSON.stringify(JSON.parse(original), null, 0);
          bundle[fileName].source = minified;
        }
      });
    }
  };
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    minifyJson(),
    copy({
      targets: [
        {
          src: 'src/databases/**/*',
          dest: 'dist/'
        }
      ],
      hook: 'writeBundle',
      flatten: false // Preserve the directory structure
    }),
    isProduction ? terser() : sourcemaps()
  ],
  external: ['fastify'],
  treeshake: true
};
