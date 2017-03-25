import flow from 'rollup-plugin-flow'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import redomx from 'rollup-plugin-redomx';

export default {
  entry: 'main.js',
  dest: 'dist/main.js',
  format: 'umd',
  moduleId: 'redomify',
  moduleName: 'Redomify',
//  sourceMap: 'false',
  plugins: [
    redomx(),
    flow(),
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
    buble()
  ]
}
