import flow from 'rollup-plugin-flow'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import redomify from './src/redomify.js'

export default {
  entry: 'src/main.js',
  dest: 'dist/redomify.js',
  format: 'umd',
  moduleId: 'redomify',
  moduleName: 'Redomify',
//  sourceMap: 'false',
  plugins: [
    flow(),
    redomify(),
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
    buble()
  ]
}
