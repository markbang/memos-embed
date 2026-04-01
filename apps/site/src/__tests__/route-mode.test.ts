import { describe, expect, it } from "vitest";
import {
	isStaticMarketingPath,
	normalizeSitePath,
	shouldHydrateSitePath,
} from "@/lib/route-mode";

describe("route mode helpers", () => {
	it("normalizes locale-prefixed and trailing-slash paths", () => {
		expect(normalizeSitePath("/")).toBe("/");
		expect(normalizeSitePath("/docs/")).toBe("/docs");
		expect(normalizeSitePath("/de/docs/")).toBe("/docs");
		expect(normalizeSitePath("/zh/playground/")).toBe("/playground");
	});

	it("marks home and docs as static marketing paths", () => {
		expect(isStaticMarketingPath("/")).toBe(true);
		expect(isStaticMarketingPath("/docs")).toBe(true);
		expect(isStaticMarketingPath("/de/docs/")).toBe(true);
		expect(isStaticMarketingPath("/playground")).toBe(false);
	});

	it("hydrates interactive routes only", () => {
		expect(shouldHydrateSitePath("/")).toBe(false);
		expect(shouldHydrateSitePath("/docs")).toBe(false);
		expect(shouldHydrateSitePath("/embed/1")).toBe(true);
		expect(shouldHydrateSitePath("/de/playground")).toBe(true);
	});
});
