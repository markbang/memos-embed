import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const run = (command, args, cwd = repoDir) => {
	console.log(`$ ${command} ${args.join(" ")}`);
	execFileSync(command, args, {
		cwd,
		stdio: "inherit",
		env: process.env,
	});
};

const findTarball = async (packsDir, prefix) => {
	const entries = await readdir(packsDir);
	const tarball = entries.find(
		(entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
	);

	if (!tarball) {
		throw new Error(`Missing tarball for ${prefix}`);
	}

	return join(packsDir, tarball);
};

const localPackageDirs = {
	react: join(repoDir, "apps/site/node_modules/react"),
	"react-dom": join(repoDir, "apps/site/node_modules/react-dom"),
	typescript: join(repoDir, "apps/site/node_modules/typescript"),
	"@types/react": join(repoDir, "apps/site/node_modules/@types/react"),
	"@types/react-dom": join(
		repoDir,
		"apps/site/node_modules/@types/react-dom",
	),
};

const tmpRoot = await mkdtemp(join(tmpdir(), "memos-embed-pack-smoke-"));
const packsDir = join(tmpRoot, "packs");
const consumerDir = join(tmpRoot, "consumer");

try {
	await mkdir(packsDir, { recursive: true });
	await mkdir(consumerDir, { recursive: true });

	run(pnpmCmd, [
		"--filter",
		"memos-embed",
		"--filter",
		"@memos-embed/react",
		"--filter",
		"@memos-embed/wc",
		"build",
	]);

	for (const pkg of ["memos-embed", "@memos-embed/react", "@memos-embed/wc"]) {
		run(pnpmCmd, ["--filter", pkg, "pack", "--pack-destination", packsDir]);
	}

	const coreTarball = await findTarball(packsDir, "memos-embed-");
	const reactTarball = await findTarball(packsDir, "memos-embed-react-");
	const wcTarball = await findTarball(packsDir, "memos-embed-wc-");

	const consumerPackageJson = {
		name: "memos-embed-pack-smoke",
		private: true,
		type: "module",
		dependencies: {
			"memos-embed": `file:${coreTarball}`,
			"@memos-embed/react": `file:${reactTarball}`,
			"@memos-embed/wc": `file:${wcTarball}`,
			react: `file:${localPackageDirs.react}`,
			"react-dom": `file:${localPackageDirs["react-dom"]}`,
		},
		devDependencies: {
			typescript: `file:${localPackageDirs.typescript}`,
			"@types/react": `file:${localPackageDirs["@types/react"]}`,
			"@types/react-dom": `file:${localPackageDirs["@types/react-dom"]}`,
		},
		pnpm: {
			overrides: {
				"memos-embed": `file:${coreTarball}`,
				"@memos-embed/react": `file:${reactTarball}`,
				"@memos-embed/wc": `file:${wcTarball}`,
			},
		},
	};

	await writeFile(
		join(consumerDir, "package.json"),
		`${JSON.stringify(consumerPackageJson, null, 2)}\n`,
	);
	await writeFile(
		join(consumerDir, "tsconfig.json"),
		`${JSON.stringify(
			{
				compilerOptions: {
					target: "ES2022",
					module: "NodeNext",
					moduleResolution: "NodeNext",
					jsx: "react-jsx",
					strict: true,
					noEmit: true,
					skipLibCheck: true,
					lib: ["ES2022", "DOM"],
				},
				include: ["consumer.tsx"],
			},
			null,
			2,
		)}\n`,
	);
	await writeFile(
		join(consumerDir, "consumer.tsx"),
		`import { MemoEmbed, MemoEmbedList } from "@memos-embed/react";
import { MemosEmbedElement, defineMemosEmbedElement } from "@memos-embed/wc";
import { renderIframeHtml, type ThemePresetName } from "memos-embed";

const theme: ThemePresetName = "midnight";
const iframe = renderIframeHtml({
  embedBaseUrl: "https://embed.example.com",
  baseUrl: "https://demo.usememos.com/api/v1",
  memoId: "1",
  autoResize: true,
});
const component = (
  <MemoEmbed
    baseUrl="https://demo.usememos.com/api/v1"
    memoId="1"
    theme={theme}
    showAttachments
    showReactions
  />
);
const list = (
  <MemoEmbedList
    baseUrl="https://demo.usememos.com/api/v1"
    memoIds={["1", "2"]}
    layout="stack"
  />
);

void iframe;
void component;
void list;
void defineMemosEmbedElement;
void MemosEmbedElement;
`,
	);
	await writeFile(
		join(consumerDir, "esm.mjs"),
		`const registry = new Map();

globalThis.HTMLElement = class {};
globalThis.customElements = {
  define(name, ctor) {
    registry.set(name, ctor);
  },
  get(name) {
    return registry.get(name);
  },
};

const core = await import("memos-embed");
const react = await import("@memos-embed/react");
const wc = await import("@memos-embed/wc");
await import("@memos-embed/wc/register");

const iframe = core.renderIframeHtml({
  embedBaseUrl: "https://embed.example.com",
  baseUrl: "https://demo.usememos.com/api/v1",
  memoId: "1",
  autoResize: true,
});

if (!iframe.includes("<iframe")) {
  throw new Error("Expected iframe HTML from ESM consumer");
}
if (!iframe.includes("memos-embed:resize")) {
  throw new Error("Expected auto-resize script in iframe HTML");
}
if (typeof react.MemoEmbed !== "function") {
  throw new Error("Expected React wrapper export from ESM consumer");
}
if (typeof react.MemoEmbedList !== "function") {
  throw new Error("Expected React list wrapper export from ESM consumer");
}
if (typeof wc.defineMemosEmbedElement !== "function") {
  throw new Error("Expected WC wrapper export from ESM consumer");
}
if (typeof registry.get("memos-embed") !== "function") {
  throw new Error("Expected register subpath to define the custom element");
}
`,
	);
	await writeFile(
		join(consumerDir, "cjs.cjs"),
		`const registry = new Map();

globalThis.HTMLElement = class {};
globalThis.customElements = {
  define(name, ctor) {
    registry.set(name, ctor);
  },
  get(name) {
    return registry.get(name);
  },
};

const core = require("memos-embed");
const react = require("@memos-embed/react");
const wc = require("@memos-embed/wc");
require("@memos-embed/wc/register");

if (typeof core.renderMemoStateHtmlSnippet !== "function") {
  throw new Error("Expected core CJS exports");
}
if (!core.renderMemoStateHtmlSnippet("ok").includes("ok")) {
  throw new Error("Expected rendered state HTML from CJS consumer");
}
if (typeof react.MemoEmbed !== "function") {
  throw new Error("Expected React CJS exports");
}
if (typeof react.MemoEmbedList !== "function") {
  throw new Error("Expected React list CJS exports");
}
if (typeof wc.defineMemosEmbedElement !== "function") {
  throw new Error("Expected WC CJS exports");
}
if (typeof registry.get("memos-embed") !== "function") {
  throw new Error("Expected WC register subpath to work in CJS");
}
`,
	);

	run(pnpmCmd, ["install", "--prefer-offline"], consumerDir);
	run(pnpmCmd, ["exec", "tsc", "-p", "tsconfig.json"], consumerDir);
	run("node", ["esm.mjs"], consumerDir);
	run("node", ["cjs.cjs"], consumerDir);
} finally {
	await rm(tmpRoot, { recursive: true, force: true });
}
