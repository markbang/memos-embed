import { describe, expect, it } from "vitest";
import { defineMemosEmbedElement } from "../index";

describe("defineMemosEmbedElement", () => {
	it("registers custom element", () => {
		defineMemosEmbedElement();
		expect(customElements.get("memos-embed")).toBeTruthy();
	});
});
