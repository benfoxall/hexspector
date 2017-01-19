import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/main.js',
  dest: 'docs/hexspector.js',
  format: 'iife',
  plugins: [ buble() ]
}
