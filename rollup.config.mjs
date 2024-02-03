import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import filesize from "rollup-plugin-filesize";
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

import { globbySync } from 'globby';
import pkg from './package.json' with { type: 'json' };

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
	.replace(/^\w/, (m) => m.toUpperCase())
	.replace(/-\w/g, (m) => m[1].toUpperCase());

const banner = `/**
 * ${pkg.name} ~ ${pkg.version}
 * ${pkg.description || ''}
 * © MPL-2.0 ~ ${pkg.author} ~ ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}
 */`;

const production = !process.env.ROLLUP_WATCH;
const components = globbySync('src/lib/components/**/*.svelte').map((path) => {
	return path.split('/').at(-1).replace('.svelte', '');
});

const exports = components.map((component) => ({
	input: `src/lib/components/${component}.svelte`,
	output: [
		{
			file: pkg.module,
			format: 'es',
			name,
			banner
		},
		{
			file: pkg.main,
			format: 'umd',
			name,
			banner
		}
	],
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			compilerOptions: {
				dev: !production,
				customElement: true
			}
		}),
		typescript(),
		css({ output: 'range-slider-pips.css' }),
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
