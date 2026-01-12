import { describe, expect, it } from "vitest";
import { MemoEmbed } from "../index";

describe("MemoEmbed", () => {
	it("exports a component", () => {
		expect(typeof MemoEmbed).toBe("function");
	});
});
