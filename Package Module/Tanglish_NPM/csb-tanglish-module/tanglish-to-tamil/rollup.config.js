import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'default',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/tanglish-to-tamil.min.js',
      format: 'umd',
      name: 'TanglishToTamil',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: 'tamil-toggle.css',
      minimize: true
    })
  ]
};
