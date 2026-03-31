type HighlightJsModule = typeof import("highlight.js/lib/core");
type HighlightLanguageModule = {
	default: Parameters<HighlightJsModule["default"]["registerLanguage"]>[1];
};

type HighlightInstance = HighlightJsModule["default"];

const languageAliases = [
	["javascript", "javascript"],
	["js", "javascript"],
	["typescript", "typescript"],
	["ts", "typescript"],
	["python", "python"],
	["py", "python"],
	["go", "go"],
	["css", "css"],
	["html", "xml"],
	["xml", "xml"],
	["json", "json"],
	["yaml", "yaml"],
	["yml", "yaml"],
	["sql", "sql"],
	["shell", "shell"],
	["bash", "shell"],
	["sh", "shell"],
	["markdown", "markdown"],
	["md", "markdown"],
] as const;

let highlightInstancePromise: Promise<HighlightInstance> | undefined;

const loadHighlightInstance = async () => {
	if (highlightInstancePromise) {
		return highlightInstancePromise;
	}

	highlightInstancePromise = (async () => {
		const [
			{ default: hljs },
			css,
			go,
			javascript,
			json,
			markdown,
			python,
			shell,
			sql,
			typescript,
			xml,
			yaml,
		] = (await Promise.all([
			import("highlight.js/lib/core"),
			import("highlight.js/lib/languages/css"),
			import("highlight.js/lib/languages/go"),
			import("highlight.js/lib/languages/javascript"),
			import("highlight.js/lib/languages/json"),
			import("highlight.js/lib/languages/markdown"),
			import("highlight.js/lib/languages/python"),
			import("highlight.js/lib/languages/shell"),
			import("highlight.js/lib/languages/sql"),
			import("highlight.js/lib/languages/typescript"),
			import("highlight.js/lib/languages/xml"),
			import("highlight.js/lib/languages/yaml"),
		])) as [
			HighlightJsModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
			HighlightLanguageModule,
		];

		const languages = {
			css: css.default,
			go: go.default,
			javascript: javascript.default,
			json: json.default,
			markdown: markdown.default,
			python: python.default,
			shell: shell.default,
			sql: sql.default,
			typescript: typescript.default,
			xml: xml.default,
			yaml: yaml.default,
		} as const;

		for (const [alias, languageKey] of languageAliases) {
			hljs.registerLanguage(alias, languages[languageKey]);
		}

		return hljs;
	})();

	return highlightInstancePromise;
};

export async function highlightCodeBlocks(container: HTMLElement) {
	const blocks = container.querySelectorAll<HTMLElement>(
		"pre[data-language] code",
	);
	if (blocks.length === 0) {
		return;
	}

	const hljs = await loadHighlightInstance();
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
