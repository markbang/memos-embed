import { describe, expect, it } from "vitest";
import {
	buildEmbedUrl,
	buildIframeResizeScript,
	renderIframeHtml,
} from "../iframe";

describe("buildEmbedUrl", () => {
	it("builds iframe url with query params", () => {
		const url = buildEmbedUrl({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			theme: "minimal",
			density: "compact",
			showTags: false,
			showAttachments: true,
			showReactions: false,
			showMeta: true,
			linkTarget: "_self",
			frameId: "memo-frame-1",
		});

		expect(url).toContain("https://embed.example.com/embed/1");
		expect(url).toContain("baseUrl=https%3A%2F%2Fdemo.usememos.com%2Fapi%2Fv1");
		expect(url).toContain("theme=minimal");
		expect(url).toContain("density=compact");
		expect(url).toContain("showTags=false");
		expect(url).toContain("showAttachments=true");
		expect(url).toContain("showReactions=false");
		expect(url).toContain("showMeta=true");
		expect(url).toContain("linkTarget=_self");
		expect(url).toContain("frameId=memo-frame-1");
	});

	it("normalizes trailing slashes in the forwarded baseUrl", () => {
		const url = buildEmbedUrl({
			embedBaseUrl: "https://embed.example.com/",
			baseUrl: "https://demo.usememos.com/api/v1/",
			memoId: "1",
		});

		expect(url).toBe(
			"https://embed.example.com/embed/1?baseUrl=https%3A%2F%2Fdemo.usememos.com%2Fapi%2Fv1",
		);
	});
});

describe("buildIframeResizeScript", () => {
	it("creates a parent-side resize listener", () => {
		const script = buildIframeResizeScript({
			frameId: "memo-frame-1",
			src: "https://embed.example.com/embed/1?frameId=memo-frame-1",
		});

		expect(script).toContain("memos-embed:resize");
		expect(script).toContain("memos-embed:measure");
		expect(script).toContain("memo-frame-1");
		expect(script).toContain("embed.example.com");
	});
});

describe("renderIframeHtml", () => {
	it("preserves string dimensions and optional iframe attributes", () => {
		const html = renderIframeHtml({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			width: "100%",
			height: "320px",
			title: "Demo",
			className: "memo-frame",
			allow: "clipboard-read",
			referrerPolicy: "strict-origin-when-cross-origin",
			sandbox: "allow-scripts allow-same-origin",
		});

		expect(html).toContain('class="memo-frame"');
		expect(html).toContain('width="100%"');
		expect(html).toContain('height="320px"');
		expect(html).toContain(
			'style="border:none;border-radius:16px;width:100%;height:320px"',
		);
		expect(html).toContain('allow="clipboard-read"');
		expect(html).toContain(
			'referrerpolicy="strict-origin-when-cross-origin"',
		);
		expect(html).toContain('sandbox="allow-scripts allow-same-origin"');
	});

	it("can emit an auto-resizing iframe snippet", () => {
		const html = renderIframeHtml({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			frameId: "memo-frame-1",
			autoResize: true,
		});

		expect(html).toContain('id="memo-frame-1"');
		expect(html).toContain("frameId=memo-frame-1");
		expect(html).toContain("<script>");
		expect(html).toContain("memos-embed:resize");
	});

	it("falls back when iframe dimensions are not safe css values", () => {
		const html = renderIframeHtml({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			width: "100%;position:fixed",
			height: "320px;transform:scale(2)",
		});

		expect(html).toContain('width="100%"');
		expect(html).toContain('height="280"');
		expect(html).toContain(
			'style="border:none;border-radius:16px;width:100%;height:280px"',
		);
		expect(html).not.toContain("position:fixed");
		expect(html).not.toContain("transform:scale(2)");
	});

	it("sanitizes frame ids before wiring auto-resize", () => {
		const html = renderIframeHtml({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			frameId: " memo frame #1 ",
			autoResize: true,
		});

		expect(html).toContain('id="memo-frame--1"');
		expect(html).toContain("frameId=memo-frame--1");
		expect(html).not.toContain("frameId=%20memo%20frame%20%231%20");
	});

	it("creates a generated frame id when auto-resize is enabled without one", () => {
		const html = renderIframeHtml({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			autoResize: true,
		});

		expect(html).toMatch(/id="memos-embed-frame-[a-z0-9]{8}"/);
		expect(html).toMatch(/frameId=memos-embed-frame-[a-z0-9]{8}/);
		expect(html).toContain("memos-embed:resize");
	});
});
