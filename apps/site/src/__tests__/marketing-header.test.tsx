import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
	useLocation: () => ({ pathname: "/" }),
}));

vi.mock("@/paraglide/runtime", () => ({
	deLocalizeHref: (href: string) => href,
	getLocale: () => "en",
	locales: ["en", "de", "zh"],
	localizeHref: (href: string) => href,
}));

import MarketingHeader from "@/components/MarketingHeader";

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe("marketing header", () => {
	it("renders the static site navigation and theme toggle", () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		render(createElement(MarketingHeader));

		expect(screen.getByRole("button", { name: "Toggle theme" })).toBeTruthy();
		expect(
			screen.getByRole("link", { name: "GitHub" }).getAttribute("href"),
		).toBe("https://github.com/markbang/memos-embed");
		expect(screen.getByText("Memos Embed")).toBeTruthy();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});
});
