import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { DocsPageContent } from "@/components/DocsPage";
import { HomePageContent } from "@/components/HomePage";

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
		const iframeExampleLink = screen.getByRole("link", {
			name: "Open integration_iframe example",
		});
		const wcExampleLink = screen.getByRole("link", {
			name: "Open integration_wc example",
		});
		const reactExampleLink = screen.getByRole("link", {
			name: "Open integration_react example",
		});
		expect(iframeExampleLink.getAttribute("href")).toBe(
			"https://github.com/markbang/memos-embed/tree/main/examples/static-html",
		);
		expect(iframeExampleLink.getAttribute("target")).toBe("_blank");
		expect(iframeExampleLink.getAttribute("rel")).toBe("noreferrer");
		expect(wcExampleLink.getAttribute("href")).toBe(
			"https://github.com/markbang/memos-embed/tree/main/examples/static-html",
		);
		expect(wcExampleLink.getAttribute("target")).toBe("_blank");
		expect(wcExampleLink.getAttribute("rel")).toBe("noreferrer");
		expect(reactExampleLink.getAttribute("href")).toBe(
			"https://github.com/markbang/memos-embed/tree/main/examples/next-mdx",
		);
		expect(reactExampleLink.getAttribute("target")).toBe("_blank");
		expect(reactExampleLink.getAttribute("rel")).toBe("noreferrer");
	});

	it("renders docs quick start, customization, and integration guide sections", () => {
		render(createElement(DocsPageContent));

		expect(screen.getByRole("heading", { name: "Documentation" })).toBeTruthy();
		expect(screen.getByText("Choose your entry point")).toBeTruthy();
		const playgroundLink = screen.getByRole("link", {
			name: "Open the playground",
		});
		const exampleGalleryLink = screen.getByRole("link", {
			name: "Browse example gallery",
		});
		const coreNpmPackageLink = screen.getByRole("link", {
			name: "View core npm package",
		});
		const reactNpmPackageLink = screen.getByRole("link", {
			name: "View React npm package",
		});
		const wcNpmPackageLink = screen.getByRole("link", {
			name: "View Web Component npm package",
		});

		expect(playgroundLink.getAttribute("href")).toBe("/playground");
		expect(exampleGalleryLink.getAttribute("href")).toBe(
			"https://github.com/markbang/memos-embed/tree/main/examples",
		);
		expect(exampleGalleryLink.getAttribute("target")).toBe("_blank");
		expect(exampleGalleryLink.getAttribute("rel")).toBe("noreferrer");
		expect(coreNpmPackageLink.getAttribute("href")).toBe(
			"https://www.npmjs.com/package/memos-embed",
		);
		expect(coreNpmPackageLink.getAttribute("target")).toBe("_blank");
		expect(coreNpmPackageLink.getAttribute("rel")).toBe("noreferrer");
		expect(reactNpmPackageLink.getAttribute("href")).toBe(
			"https://www.npmjs.com/package/@memos-embed/react",
		);
		expect(reactNpmPackageLink.getAttribute("target")).toBe("_blank");
		expect(reactNpmPackageLink.getAttribute("rel")).toBe("noreferrer");
		expect(wcNpmPackageLink.getAttribute("href")).toBe(
			"https://www.npmjs.com/package/@memos-embed/wc",
		);
		expect(wcNpmPackageLink.getAttribute("target")).toBe("_blank");
		expect(wcNpmPackageLink.getAttribute("rel")).toBe("noreferrer");
		expect(
			screen.getAllByText(/^pnpm add @memos-embed\/react memos-embed/m).length,
		).toBeGreaterThanOrEqual(2);
		expect(screen.getAllByText("Core HTML API")).toHaveLength(2);
		expect(screen.getByText("Iframe helpers")).toBeTruthy();
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
