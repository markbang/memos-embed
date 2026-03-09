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
			screen.getByRole("heading", { name: /hero_title_main/i }),
		).toBeTruthy();
		expect(
			screen
				.getAllByRole("link", { name: "hero_btn_playground" })[0]
				.getAttribute("href"),
		).toBe("/playground");
		expect(
			screen.getByRole("heading", {
				name: "section_integration_title",
			}),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "feature_beautiful_title" }),
		).toBeTruthy();
		expect(
			screen.getByRole("heading", { name: "feature_developer_title" }),
		).toBeTruthy();
	});

	it("renders docs quick start, customization, and integration guide sections", () => {
		render(createElement(DocsPageContent));

		expect(screen.getByRole("heading", { name: "Documentation" })).toBeTruthy();
		expect(screen.getByText("Quick Start")).toBeTruthy();
		expect(screen.getByText("Multiple memos on one page")).toBeTruthy();
		expect(screen.getByText("React memo roundup")).toBeTruthy();
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
