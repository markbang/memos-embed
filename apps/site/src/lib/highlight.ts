type HighlightJsModule = typeof import("highlight.js/lib/core");
type HighlightLanguageModule = {
	default: Parameters<HighlightJsModule["default"]["registerLanguage"]>[1];
};

type HighlightInstance = HighlightJsModule["default"];
type HighlightLanguageKey = keyof typeof highlightLanguageImporters;

const highlightLanguageImporters = {
	css: () => import("highlight.js/lib/languages/css"),
	go: () => import("highlight.js/lib/languages/go"),
	javascript: () => import("highlight.js/lib/languages/javascript"),
	json: () => import("highlight.js/lib/languages/json"),
	markdown: () => import("highlight.js/lib/languages/markdown"),
	python: () => import("highlight.js/lib/languages/python"),
	shell: () => import("highlight.js/lib/languages/shell"),
	sql: () => import("highlight.js/lib/languages/sql"),
	typescript: () => import("highlight.js/lib/languages/typescript"),
	xml: () => import("highlight.js/lib/languages/xml"),
	yaml: () => import("highlight.js/lib/languages/yaml"),
} as const satisfies Record<string, () => Promise<HighlightLanguageModule>>;

const languageAliases = {
	bash: "shell",
	css: "css",
	go: "go",
	html: "xml",
	javascript: "javascript",
	js: "javascript",
	json: "json",
	markdown: "markdown",
	md: "markdown",
	py: "python",
	python: "python",
	sh: "shell",
	shell: "shell",
	sql: "sql",
	ts: "typescript",
	typescript: "typescript",
	xml: "xml",
	yaml: "yaml",
	yml: "yaml",
} as const satisfies Record<string, HighlightLanguageKey>;

let highlightStylesPromise: Promise<unknown> | undefined;
let highlightInstancePromise: Promise<HighlightInstance> | undefined;
const registeredHighlightLanguages = new Set<string>();
const highlightLanguagePromises = new Map<
	HighlightLanguageKey,
	Promise<HighlightLanguageModule>
>();

const loadHighlightStyles = () => {
	if (highlightStylesPromise) {
		return highlightStylesPromise;
	}

	highlightStylesPromise = import("./highlight-theme.css");
	return highlightStylesPromise;
};

const loadHighlightInstance = async () => {
	if (highlightInstancePromise) {
		return highlightInstancePromise;
	}

	highlightInstancePromise = import("highlight.js/lib/core").then(
		(mod) => mod.default,
	);

	return highlightInstancePromise;
};

const resolveHighlightLanguage = (language: string) => {
	return languageAliases[
		language.toLowerCase() as keyof typeof languageAliases
	];
};

const loadHighlightLanguage = async (language: HighlightLanguageKey) => {
	const hljs = await loadHighlightInstance();
	if (registeredHighlightLanguages.has(language)) {
		return hljs;
	}

	let languagePromise = highlightLanguagePromises.get(language);
	if (!languagePromise) {
		languagePromise = highlightLanguageImporters[language]();
		highlightLanguagePromises.set(language, languagePromise);
	}

	const languageModule = await languagePromise;
	for (const [alias, languageKey] of Object.entries(languageAliases)) {
		if (languageKey === language) {
			hljs.registerLanguage(alias, languageModule.default);
		}
	}
	registeredHighlightLanguages.add(language);
	return hljs;
};

const getRequestedHighlightLanguages = (blocks: NodeListOf<HTMLElement>) => {
	const languages = new Set<HighlightLanguageKey>();
	for (const block of blocks) {
		const language = block.parentElement?.getAttribute("data-language") ?? "";
		const resolvedLanguage = resolveHighlightLanguage(language);
		if (resolvedLanguage) {
			languages.add(resolvedLanguage);
		}
	}
	return languages;
};

export async function highlightCodeBlocks(container: HTMLElement) {
	const blocks = container.querySelectorAll<HTMLElement>(
		"pre[data-language] code",
	);
	if (blocks.length === 0) {
		return;
	}

	await loadHighlightStyles();
	const requestedLanguages = getRequestedHighlightLanguages(blocks);
	const hljs = await loadHighlightInstance();
	await Promise.all(
		Array.from(requestedLanguages, (language) =>
			loadHighlightLanguage(language),
		),
	);

	for (const block of blocks) {
		const language = block.parentElement?.getAttribute("data-language") ?? "";
		if (language && hljs.getLanguage(language)) {
			block.classList.add(`language-${language}`);
			hljs.highlightElement(block);
		} else {
			hljs.highlightElement(block);
		}
	}
}
