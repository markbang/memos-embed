import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
	it("prefers the latest display and width utility within the same variant scope", () => {
		const className = cn(
			"inline-flex w-fit gap-2 rounded-lg",
			"grid w-full grid-cols-3 gap-6",
		);

		expect(className).toContain("grid");
		expect(className).toContain("w-full");
		expect(className).toContain("gap-6");
		expect(className).not.toContain("inline-flex");
		expect(className).not.toContain("w-fit");
		expect(className).not.toContain("gap-2");
	});

	it("keeps responsive overrides separate while merging unscoped conflicts", () => {
		const className = cn(
			"inline-flex text-base md:text-sm",
			"hidden md:inline-flex text-xs",
		);
		const tokens = className.split(/\s+/);

		expect(tokens).toContain("hidden");
		expect(tokens).toContain("md:inline-flex");
		expect(tokens).toContain("text-xs");
		expect(tokens).toContain("md:text-sm");
		expect(tokens).not.toContain("inline-flex");
		expect(tokens).not.toContain("text-base");
	});

	it("merges background and shadow utilities without dropping unrelated border colors", () => {
		const className = cn(
			"border bg-card text-card-foreground shadow-sm",
			"border-border/70 bg-card/80 shadow-lg",
		);

		expect(className).toContain("border");
		expect(className).toContain("border-border/70");
		expect(className).toContain("bg-card/80");
		expect(className).toContain("shadow-lg");
		expect(className).not.toContain("bg-card ");
		expect(className).not.toContain("shadow-sm");
	});
});
