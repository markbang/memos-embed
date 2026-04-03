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
		const pkgDir = join(
			repoDir,
			pkg === "memos-embed"
				? "packages/memos-embed"
				: pkg === "@memos-embed/react"
					? "packages/memos-embed-react"
					: "packages/memos-embed-wc",
		);
		run(pnpmCmd, ["pack", "--pack-destination", packsDir], pkgDir);
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
		`import { MemoClientProvider, MemoEmbed, MemoEmbedList, useMemoClient } from "@memos-embed/react";
import { MemosEmbedElement, defineMemosEmbedElement } from "@memos-embed/wc";
import { createMemoClient, fetchMemo, fetchMemos, renderIframeHtml, type Memo, type ThemePresetName } from "memos-embed";

const theme: ThemePresetName = "midnight";
const client = createMemoClient();
const iframe = renderIframeHtml({
  embedBaseUrl: "https://embed.example.com",
  baseUrl: "https://demo.usememos.com/api/v1",
  memoId: "1",
  autoResize: true,
});
const prefetchedMemo: Memo = {
  id: "1",
  name: "memos/1",
  content: "Prefetched memo",
  tags: [],
  attachments: [],
  reactions: [],
};
const prefetchedMemos: Memo[] = [
  prefetchedMemo,
  {
    id: "2",
    name: "memos/2",
    content: "Prefetched list item",
    tags: [],
    attachments: [],
    reactions: [],
  },
];
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
const prefetchedProvider = (
  <MemoClientProvider client={client}>
    <MemoEmbed baseUrl="https://demo.usememos.com/api/v1" memo={prefetchedMemo} />
    <MemoEmbedList baseUrl="https://demo.usememos.com/api/v1" memos={prefetchedMemos} />
  </MemoClientProvider>
);
const provider = (
  <MemoClientProvider client={client}>
    {component}
    {list}
    {prefetchedProvider}
  </MemoClientProvider>
);

const reuseClient = useMemoClient(client);
const memoFetcher: typeof fetchMemo = fetchMemo;
const memosFetcher: typeof fetchMemos = fetchMemos;

void iframe;
void provider;
void defineMemosEmbedElement;
void MemosEmbedElement;
void reuseClient;
void memoFetcher;
void memosFetcher;
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
if (typeof react.MemoClientProvider !== "function") {
  throw new Error("Expected React provider export from ESM consumer");
}
if (typeof core.createMemoClient !== "function") {
  throw new Error("Expected shared memo client export from ESM consumer");
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
if (typeof react.MemoClientProvider !== "function") {
  throw new Error("Expected React provider CJS exports");
}
if (typeof core.createMemoClient !== "function") {
  throw new Error("Expected shared memo client CJS exports");
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
