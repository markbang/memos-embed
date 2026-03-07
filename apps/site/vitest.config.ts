import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: [
			{
				find: /^@\/paraglide\/messages$/,
				replacement: resolve(__dirname, "src/test/paraglide-messages.mock.ts"),
			},
			{
				find: /^@\/paraglide\/runtime$/,
				replacement: resolve(__dirname, "src/test/paraglide-runtime.mock.ts"),
			},
			{
				find: /^memos-embed$/,
				replacement: resolve(
					__dirname,
					"../../packages/memos-embed/src/index.ts",
				),
			},
			{
				find: /^@memos-embed\/react$/,
				replacement: resolve(
					__dirname,
					"../../packages/memos-embed-react/src/index.tsx",
				),
			},
			{
				find: /^@memos-embed\/wc$/,
				replacement: resolve(
					__dirname,
					"../../packages/memos-embed-wc/src/index.ts",
				),
			},
			{
				find: "@",
				replacement: resolve(__dirname, "src"),
			},
		],
	},
	test: {
		environment: "happy-dom",
	},
});
