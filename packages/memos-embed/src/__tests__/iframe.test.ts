import { describe, expect, it } from "vitest";
import { buildEmbedUrl } from "../iframe";

describe("buildEmbedUrl", () => {
	it("builds iframe url with query params", () => {
		const url = buildEmbedUrl({
			embedBaseUrl: "https://embed.example.com",
			baseUrl: "https://demo.usememos.com/api/v1",
			memoId: "1",
			theme: "minimal",
			density: "compact",
		});

		expect(url).toContain("https://embed.example.com/embed/1");
		expect(url).toContain("baseUrl=https%3A%2F%2Fdemo.usememos.com%2Fapi%2Fv1");
		expect(url).toContain("theme=minimal");
		expect(url).toContain("density=compact");
	});
});
