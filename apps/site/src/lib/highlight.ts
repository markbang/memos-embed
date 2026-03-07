import hljs from "highlight.js/lib/core";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("bash", shell);
hljs.registerLanguage("sh", shell);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown);

export function highlightCodeBlocks(container: HTMLElement) {
	const blocks = container.querySelectorAll<HTMLElement>("pre[data-language] code");
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
