import { describe, expect, it } from "vitest";
import { getRootBodyClassName } from "@/routes/__root";

describe("getRootBodyClassName", () => {
	it("marks embed routes so shell chrome can be hidden", () => {
		expect(getRootBodyClassName("/embed/1")).toBe("memos-embed-route");
		expect(getRootBodyClassName("/playground")).toBeUndefined();
		expect(getRootBodyClassName("/")).toBeUndefined();
	});
});
