import { defineConfig } from "vite";
import { resolve } from "node:path";
import { devtools } from "@tanstack/devtools-vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
	resolve: {
		alias: {
			"memos-embed": resolve(
				__dirname,
				"../../packages/memos-embed/src/index.ts",
			),
			"@memos-embed/react": resolve(
				__dirname,
				"../../packages/memos-embed-react/src/index.tsx",
			),
			"@memos-embed/wc": resolve(
				__dirname,
				"../../packages/memos-embed-wc/src/index.ts",
			),
		},
	},
	plugins: [
		devtools(),
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["url"],
		}),
		nitro(),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
