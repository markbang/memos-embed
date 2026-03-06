import { escapeHtml, sanitizeUrl } from "./html";

type MarkdownRenderOptions = {
	linkTarget?: "_blank" | "_self";
};

const inlineCodeToken = "__MEMOS_EMBED_INLINE_CODE__";

const renderInline = (
	value: string,
	options: MarkdownRenderOptions = {},
) => {
	const target = options.linkTarget ?? "_blank";
	const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
	const codeBlocks: string[] = [];

	let output = escapeHtml(value).replace(/`([^`]+)`/g, (_match, code) => {
		const placeholder = `${inlineCodeToken}${codeBlocks.length}__`;
		codeBlocks.push(`<code>${code}</code>`);
		return placeholder;
	});

	output = output.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_match, text, url) => {
		const safeUrl = sanitizeUrl(url);
		return `<a href="${escapeHtml(safeUrl)}" target="${target}"${rel}>${text}</a>`;
	});

	output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
	output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");

	return output.replace(
		new RegExp(`${inlineCodeToken}(\\d+)__`, "g"),
		(_match, index) => codeBlocks[Number(index)] ?? "",
	);
};

const renderParagraphs = (
	lines: string[],
	options: MarkdownRenderOptions = {},
) => {
	const paragraphs: string[] = [];
	let currentLines: string[] = [];

	const flush = () => {
		if (currentLines.length === 0) {
			return;
		}
		paragraphs.push(
			`<p>${currentLines
				.map((line) => renderInline(line, options))
				.join("<br />")}</p>`,
		);
		currentLines = [];
	};

	for (const line of lines) {
		if (!line.trim()) {
			flush();
			continue;
		}
		currentLines.push(line);
	}

	flush();
	return paragraphs.join("");
};

const isUnorderedListItem = (value: string) => /^[-*]\s+/.test(value.trim());
const isOrderedListItem = (value: string) => /^\d+\.\s+/.test(value.trim());
const isFence = (value: string) => /^```/.test(value.trim());
const isHorizontalRule = (value: string) => /^([-*_])\1{2,}$/.test(value.trim());
const isHeading = (value: string) => /^#{1,6}\s+/.test(value.trim());
const isBlockquote = (value: string) => /^>\s?/.test(value.trim());

const parseTaskListItem = (value: string) => {
	const match = value.match(/^\[( |x|X)]\s+(.*)$/);
	if (!match) {
		return undefined;
	}

	return {
		checked: match[1]?.toLowerCase() === "x",
		content: match[2] ?? "",
	};
};

const renderList = (
	items: string[],
	ordered: boolean,
	options: MarkdownRenderOptions = {},
) => {
	const listTag = ordered ? "ol" : "ul";
	const hasTaskItems = !ordered && items.some((item) => parseTaskListItem(item));
	const listAttrs = hasTaskItems ? ' data-task-list="true"' : "";

	return `<${listTag}${listAttrs}>${items
		.map((item) => {
			const task = !ordered ? parseTaskListItem(item) : undefined;
			if (!task) {
				return `<li>${renderInline(item, options)}</li>`;
			}

			return `<li class="memos-embed__task-item" data-checked="${task.checked ? "true" : "false"}"><input class="memos-embed__task-checkbox" type="checkbox" disabled${task.checked ? " checked" : ""} aria-hidden="true" /><span>${renderInline(task.content, options)}</span></li>`;
		})
		.join("")}</${listTag}>`;
};

export const renderMarkdown = (
	value: string,
	options: MarkdownRenderOptions = {},
) => {
	const normalized = value.replace(/\r\n?/g, "\n");
	const lines = normalized.split("\n");
	const blocks: string[] = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index] ?? "";
		const trimmed = line.trim();

		if (!trimmed) {
			index += 1;
			continue;
		}

		if (isFence(line)) {
			const language = trimmed.slice(3).trim();
			index += 1;
			const codeLines: string[] = [];
			while (index < lines.length && !isFence(lines[index] ?? "")) {
				codeLines.push(lines[index] ?? "");
				index += 1;
			}
			if (index < lines.length) {
				index += 1;
			}
			const languageAttr = language
				? ` data-language="${escapeHtml(language)}"`
				: "";
			blocks.push(
				`<pre${languageAttr}><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`,
			);
			continue;
		}

		if (isHorizontalRule(line)) {
			blocks.push("<hr />");
			index += 1;
			continue;
		}

		if (isHeading(line)) {
			const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
			const depth = match?.[1]?.length ?? 1;
			const content = match?.[2] ?? trimmed;
			blocks.push(
				`<h${depth}>${renderInline(content, options)}</h${depth}>`,
			);
			index += 1;
			continue;
		}

		if (isBlockquote(line)) {
			const quoteLines: string[] = [];
			while (index < lines.length && isBlockquote(lines[index] ?? "")) {
				quoteLines.push((lines[index] ?? "").replace(/^>\s?/, ""));
				index += 1;
			}
			blocks.push(
				`<blockquote>${renderParagraphs(quoteLines, options)}</blockquote>`,
			);
			continue;
		}

		if (isUnorderedListItem(line) || isOrderedListItem(line)) {
			const ordered = isOrderedListItem(line);
			const items: string[] = [];
			while (index < lines.length) {
				const current = lines[index] ?? "";
				const matchesCurrentType = ordered
					? isOrderedListItem(current)
					: isUnorderedListItem(current);
				if (!matchesCurrentType) {
					break;
				}
				items.push(
					ordered
						? current.trim().replace(/^\d+\.\s+/, "")
						: current.trim().replace(/^[-*]\s+/, ""),
				);
				index += 1;
			}
			blocks.push(renderList(items, ordered, options));
			continue;
		}

		const paragraphLines: string[] = [];
		while (index < lines.length) {
			const current = lines[index] ?? "";
			const currentTrimmed = current.trim();
			if (!currentTrimmed) {
				paragraphLines.push("");
				index += 1;
				break;
			}
			if (
				isFence(current) ||
				isHeading(current) ||
				isBlockquote(current) ||
				isUnorderedListItem(current) ||
				isOrderedListItem(current) ||
				isHorizontalRule(current)
			) {
				break;
			}
			paragraphLines.push(current);
			index += 1;
		}
		blocks.push(renderParagraphs(paragraphLines, options));
	}

	return blocks.join("");
};
