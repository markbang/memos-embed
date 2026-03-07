import { resolve } from "node:path";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const createManualChunk = (id: string) => {
	if (!id.includes("node_modules")) {
		return undefined;
	}

	if (
		id.includes("/node_modules/react/") ||
		id.includes("/node_modules/react-dom/")
	) {
		return "react-vendor";
	}

	if (id.includes("/node_modules/@tanstack/")) {
		return "tanstack-vendor";
	}

	if (id.includes("/node_modules/@radix-ui/")) {
		return "radix-vendor";
	}

	if (id.includes("/node_modules/lucide-react/")) {
		return "ui-icons";
	}

	return undefined;
};

const config = defineConfig({
	build: {
		rollupOptions: {
			output: {
				manualChunks: createManualChunk,
			},
		},
	},
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
