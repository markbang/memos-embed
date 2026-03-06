import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../markdown";

describe("renderMarkdown", () => {
	it("renders headings, lists, blockquotes, fenced code blocks, and task lists", () => {
		const html = renderMarkdown(`# Title

- one
- [x] done
- [ ] todo

> quoted
> line

\`\`\`ts
const value = 1 < 2;
\`\`\`
`, {});

		expect(html).toContain("<h1>Title</h1>");
		expect(html).toContain("<ul data-task-list=\"true\">");
		expect(html).toContain('class="memos-embed__task-item"');
		expect(html).toContain('type="checkbox" disabled checked');
		expect(html).toContain("<blockquote><p>quoted<br />line</p></blockquote>");
		expect(html).toContain(
			'<pre data-language="ts"><code>const value = 1 &lt; 2;</code></pre>',
		);
	});

	it("sanitizes unsafe links", () => {
		const html = renderMarkdown("[bad](javascript:alert(1))");

		expect(html).toContain('href="#"');
	});

	it("supports configurable link targets", () => {
		const html = renderMarkdown("[site](https://example.com)", {
			linkTarget: "_self",
		});

		expect(html).toContain('target="_self"');
		expect(html).not.toContain("noopener noreferrer");
	});
});
