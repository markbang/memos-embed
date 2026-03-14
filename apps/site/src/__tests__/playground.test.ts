import { describe, expect, it } from "vitest";
import {
	buildEmbedPreviewUrl,
	buildIframeCode,
	buildReactCode,
	buildShareUrl,
	buildWebComponentCode,
	defaultPlaygroundState,
	normalizePlaygroundSearch,
} from "@/lib/playground";

describe("playground helpers", () => {
	it("normalizes search params into a complete state object", () => {
		const state = normalizePlaygroundSearch({
			baseUrl: " https://demo.usememos.com/api/v1 ",
			memoId: " 42 ",
			theme: "midnight",
			density: "compact",
			linkTarget: "_self",
			showTags: "false",
			showAttachments: "true",
			showReactions: "false",
			showMeta: "true",
		});

		expect(state).toEqual({
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "42",
			theme: "midnight",
			density: "compact",
			linkTarget: "_self",
			showTags: false,
			showAttachments: true,
			showReactions: false,
			showMeta: true,
		});
	});

	it("builds preview and share urls with visibility flags and link behavior", () => {
		const state = {
			...defaultPlaygroundState,
			linkTarget: "_self" as const,
			showAttachments: false,
			showReactions: false,
		};

		const previewUrl = buildEmbedPreviewUrl("https://embed.example.com", state);
		const shareUrl = buildShareUrl("https://embed.example.com", state);

		expect(previewUrl).toContain("/embed/1");
		expect(previewUrl).toContain("linkTarget=_self");
		expect(previewUrl).toContain("showAttachments=false");
		expect(previewUrl).toContain("showReactions=false");
		expect(shareUrl).toContain("/playground?");
		expect(shareUrl).toContain("linkTarget=_self");
		expect(shareUrl).toContain("showAttachments=false");
	});

	it("generates iframe, React, and Web Component snippets with current options", () => {
		const state = {
			...defaultPlaygroundState,
			linkTarget: "_self" as const,
			showTags: false,
			showMeta: false,
		};

		const iframeCode = buildIframeCode("https://embed.example.com", state);
		const reactCode = buildReactCode(state);
		const wcCode = buildWebComponentCode(state);

		expect(iframeCode).toContain("<iframe");
		expect(iframeCode).toContain("frameId=");
		expect(iframeCode).toContain("linkTarget=_self");
		expect(iframeCode).toContain("memos-embed:resize");
		expect(reactCode).toContain('linkTarget="_self"');
		expect(reactCode).toContain("showTags={false}");
		expect(reactCode).toContain("showMeta={false}");
		expect(wcCode).toContain('link-target="_self"');
		expect(wcCode).toContain('show-tags="false"');
		expect(wcCode).toContain('show-meta="false"');
	});
});
