import buble from 'rollup-plugin-buble'
import svelte from 'rollup-plugin-svelte'

export default {
  entry: 'src/main.js',
  dest: 'docs/hexspector.js',
  format: 'iife',
  plugins: [ svelte(), buble() ]
}
