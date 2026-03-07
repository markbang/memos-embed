import { describe, expect, it, vi } from "vitest";
import {
	applyResolvedSiteTheme,
	applySiteTheme,
	buildThemeInitializationScript,
	readStoredSiteTheme,
	resolveSiteTheme,
	SITE_THEME_MEDIA_QUERY,
	SITE_THEME_STORAGE_KEY,
	writeStoredSiteTheme,
} from "@/lib/site-theme";

describe("site theme helpers", () => {
	it("reads and writes persisted theme preferences", () => {
		const storage = {
			store: new Map<string, string>(),
			getItem(key: string) {
				return this.store.get(key) ?? null;
			},
			setItem(key: string, value: string) {
				this.store.set(key, value);
			},
			removeItem(key: string) {
				this.store.delete(key);
			},
		};

		expect(readStoredSiteTheme(storage)).toBe("system");
		writeStoredSiteTheme("dark", storage);
		expect(storage.store.get(SITE_THEME_STORAGE_KEY)).toBe("dark");
		expect(readStoredSiteTheme(storage)).toBe("dark");
		writeStoredSiteTheme("system", storage);
		expect(storage.store.has(SITE_THEME_STORAGE_KEY)).toBe(false);
	});

	it("resolves and applies the active theme", () => {
		const rootElement = document.documentElement;
		rootElement.classList.remove("dark");
		delete rootElement.dataset.theme;

		expect(
			resolveSiteTheme("system", {
				matchMedia: vi.fn(() => ({ matches: true })),
			}),
		).toBe("dark");

		applyResolvedSiteTheme("light", rootElement);
		expect(rootElement.classList.contains("dark")).toBe(false);
		expect(rootElement.dataset.theme).toBe("light");

		const resolved = applySiteTheme({
			theme: "dark",
			currentWindow: {
				matchMedia: vi.fn(() => ({ matches: false })),
			},
			rootElement,
		});
		expect(resolved).toBe("dark");
		expect(rootElement.classList.contains("dark")).toBe(true);
		expect(rootElement.dataset.theme).toBe("dark");
	});

	it("builds an inline script that handles system mode before hydration", () => {
		const script = buildThemeInitializationScript();

		expect(script).toContain(SITE_THEME_STORAGE_KEY);
		expect(script).toContain(SITE_THEME_MEDIA_QUERY);
		expect(script).toContain("document.documentElement.classList.toggle");
	});
});
