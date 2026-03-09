import { describe, expect, it } from "vitest";
import { extendTheme, resolveTheme, themePresets } from "../theme";

describe("resolveTheme", () => {
	it("falls back to the default theme for unknown input", () => {
		expect(resolveTheme()).toEqual(themePresets.minimal);
	});
});

describe("extendTheme", () => {
	it("merges overrides on top of a preset", () => {
		const theme = extendTheme("paper", {
			radius: "24px",
			fontFamily: "inherit",
			tokens: {
				background: "var(--card)",
				foreground: "var(--card-foreground)",
				accent: "var(--primary)",
			},
		});

		expect(theme.name).toBe("paper");
		expect(theme.radius).toBe("24px");
		expect(theme.fontFamily).toBe("inherit");
		expect(theme.tokens.background).toBe("var(--card)");
		expect(theme.tokens.foreground).toBe("var(--card-foreground)");
		expect(theme.tokens.accent).toBe("var(--primary)");
		expect(theme.tokens.border).toBe(themePresets.paper.tokens.border);
	});

	it("can extend a partial custom theme input", () => {
		const theme = extendTheme(
			{
				name: "minimal",
				tokens: {
					background: "#101010",
				},
			},
			{
				tokens: {
					foreground: "#f5f5f5",
				},
			},
		);

		expect(theme.tokens.background).toBe("#101010");
		expect(theme.tokens.foreground).toBe("#f5f5f5");
		expect(theme.tokens.accent).toBe(themePresets.minimal.tokens.accent);
	});
});
