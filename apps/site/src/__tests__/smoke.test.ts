import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { DocsPageContent } from "@/routes/docs/index";
import { HomePageContent } from "@/routes/index";

afterEach(() => {
	cleanup();
});

describe("site smoke", () => {
	it("renders the homepage hero, integration section, and feature cards", () => {
		render(createElement(HomePageContent));

		expect(
			screen.getByRole("heading", { name: /share your thoughts/i }),
		).toBeTruthy();
		expect(
			screen
				.getAllByRole("link", { name: "Open Playground" })[0]
				.getAttribute("href"),
		).toBe("/playground");
		expect(
			screen.getByRole("heading", {
				name: "Choose the integration that fits your stack",
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "Beautiful Embeds" }),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "Developer Friendly" }),
		).toBeTruthy();
	});

	it("renders docs quick start, customization, and integration guide sections", () => {
		render(createElement(DocsPageContent));

		expect(screen.getByRole("heading", { name: "Documentation" })).toBeTruthy();
		expect(screen.getByText("Quick Start")).toBeTruthy();
		expect(screen.getByText("Multiple memos on one page")).toBeTruthy();
		expect(screen.getByText("React memo roundup")).toBeTruthy();
		expect(screen.getByText("Shared React memo client")).toBeTruthy();
		expect(screen.getByText("Rendering Options")).toBeTruthy();
		expect(screen.getByText("includeStyles")).toBeTruthy();
		expect(screen.getByText("Theme Presets")).toBeTruthy();
		expect(screen.getByText("Match your blog theme")).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "Blog Integration Guides" }),
		).toBeTruthy();
		expect(screen.getByText("Next.js App Router")).toBeTruthy();
	});
});
