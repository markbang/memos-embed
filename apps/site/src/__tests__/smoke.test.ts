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

	it("renders docs quick start and rendering options sections", () => {
		render(createElement(DocsPageContent));

		expect(screen.getByRole("heading", { name: "Documentation" })).toBeTruthy();
		expect(screen.getByText("Quick Start")).toBeTruthy();
		expect(screen.getByText("Rendering Options")).toBeTruthy();
		expect(screen.getByText("showAttachments")).toBeTruthy();
		expect(screen.getByText("Theme Presets")).toBeTruthy();
	});
});
