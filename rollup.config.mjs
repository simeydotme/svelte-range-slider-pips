import fs from 'fs';
import del from 'rollup-plugin-delete';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

import { globbySync } from 'globby';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// for use with exports options
const packageName = pkg.name.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3');

// this is the name of the component when imported
// like: import { Component } from 'package' or require('package').Component
// and: const myComponent = new Component();
const moduleName = packageName
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

// banner to be added to the top of each generated file
const banner = `/**
 * ${pkg.name} ~ ${pkg.version}
 * ${pkg.description || ''}
 * ${pkg.homepage ? `Project home: ${pkg.homepage}` : ''}
 * © ${new Date().getFullYear()} ${pkg.author} ~ ${pkg.license} License
 * Published: ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}
 */`;

const production = !process.env.ROLLUP_WATCH;
const components = globbySync('src/lib/components/**/*.svelte').map((path) => {
  return path.split('/').at(-1).replace('.svelte', '');
});

const exports = components.map((component) => ({
  input: `src/lib/components/${component}.svelte`,
  output: [
    {
      file: pkg.exports['.'][0].import,
      format: 'es',
      name: moduleName,
      banner
    },
    {
      file: pkg.exports['.'][0].require,
      format: 'umd',
      name: moduleName,
      banner
    }
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    svelte({
      preprocess: autoPreprocess(),
      compilerOptions: {
        dev: !production,
        customElement: true,
        immutable: false
      }
    }),
    typescript({
      exclude: ['node_modules/**', 'tests/**']
    }),
    css({ output: pkg.exports['.'][0].style.split('/').at(-1) }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    filesize()
  ],
  watch: {
    clearScreen: false
  }
}));

export default exports;
