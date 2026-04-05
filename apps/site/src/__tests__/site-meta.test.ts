import { describe, expect, it } from "vitest";
import { buildPageHead, getPageTitle, SITE_NAME } from "@/lib/site-meta";

describe("site meta helpers", () => {
	it("builds page titles with the site name suffix", () => {
		expect(getPageTitle()).toBe(SITE_NAME);
		expect(getPageTitle("Playground")).toBe("Playground · Memos Embed");
	});

	it("returns social and description metadata for a page", () => {
		const head = buildPageHead({
			title: "Docs",
			description: "Learn how to embed memo cards.",
		});

		expect(head.meta).toEqual(
			expect.arrayContaining([
				{ title: "Docs · Memos Embed" },
				{ name: "description", content: "Learn how to embed memo cards." },
				{ property: "og:type", content: "website" },
				{ name: "twitter:card", content: "summary_large_image" },
				{
					property: "og:image",
					content: "https://memos-embed.vercel.app/android-chrome-512x512.png",
				},
				{
					name: "twitter:image",
					content: "https://memos-embed.vercel.app/android-chrome-512x512.png",
				},
			]),
		);
	});
});
