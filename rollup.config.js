import svelte from "rollup-plugin-svelte";
import filesize from "rollup-plugin-filesize";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

const name = pkg.name
	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
	.replace(/^\w/, m => m.toUpperCase())
	.replace(/-\w/g, m => m[1].toUpperCase());

const banner = `/**
 * ${pkg.name} ~ ${pkg.version}
 * ${pkg.description}
 * © MPL-2.0 ~ ${pkg.author} ~ ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}
 */`

export default {
	input: "src/index.js",
	output: [
		{ 
			file: pkg.module, 
			format: "es",
			banner
		},
		{ 
			file: pkg.main, 
			format: "umd",
			name,
			banner
		}
	],
	plugins: [
		svelte(),
		resolve(),
		filesize()
	]
};
