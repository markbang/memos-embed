export const SITE_THEME_STORAGE_KEY = "memos-embed-site-theme";
export const SITE_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export type SiteThemeMode = "light" | "dark" | "system";
export type ResolvedSiteTheme = Exclude<SiteThemeMode, "system">;

type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;
type MatchMediaLike = Pick<Window, "matchMedia">;
type RootElementLike = Pick<HTMLElement, "classList" | "dataset">;

export const isSiteThemeMode = (value: unknown): value is SiteThemeMode =>
	value === "light" || value === "dark" || value === "system";

export const readStoredSiteTheme = (storage?: StorageLike): SiteThemeMode => {
	if (!storage) {
		return "system";
	}

	try {
		const value = storage.getItem(SITE_THEME_STORAGE_KEY);
		return isSiteThemeMode(value) ? value : "system";
	} catch {
		return "system";
	}
};

export const writeStoredSiteTheme = (
	theme: SiteThemeMode,
	storage?: StorageLike,
) => {
	if (!storage) {
		return;
	}

	try {
		if (theme === "system") {
			storage.removeItem(SITE_THEME_STORAGE_KEY);
			return;
		}

		storage.setItem(SITE_THEME_STORAGE_KEY, theme);
	} catch {
		// ignore storage failures in restricted environments
	}
};

export const resolveSiteTheme = (
	theme: SiteThemeMode,
	currentWindow?: MatchMediaLike,
): ResolvedSiteTheme => {
	if (theme === "light" || theme === "dark") {
		return theme;
	}

	return currentWindow?.matchMedia?.(SITE_THEME_MEDIA_QUERY).matches
		? "dark"
		: "light";
};

export const applyResolvedSiteTheme = (
	theme: ResolvedSiteTheme,
	rootElement?: RootElementLike,
) => {
	if (!rootElement) {
		return;
	}

	rootElement.classList.toggle("dark", theme === "dark");
	rootElement.dataset.theme = theme;
};

export const applySiteTheme = ({
	theme,
	storage,
	currentWindow,
	rootElement,
}: {
	theme: SiteThemeMode;
	storage?: StorageLike;
	currentWindow?: MatchMediaLike;
	rootElement?: RootElementLike;
}) => {
	writeStoredSiteTheme(theme, storage);
	const resolvedTheme = resolveSiteTheme(theme, currentWindow);
	applyResolvedSiteTheme(resolvedTheme, rootElement);
	return resolvedTheme;
};

export const buildThemeInitializationScript = () =>
	`(() => {try {const key = ${JSON.stringify(SITE_THEME_STORAGE_KEY)};const stored = localStorage.getItem(key);const theme = stored === "light" || stored === "dark" ? stored : "system";const resolved = theme === "dark" || (theme === "system" && window.matchMedia(${JSON.stringify(
		SITE_THEME_MEDIA_QUERY,
	)}).matches) ? "dark" : "light";document.documentElement.classList.toggle("dark", resolved === "dark");document.documentElement.dataset.theme = resolved;} catch {}})();`;

export const buildThemeToggleBindingScript = () =>
	`(() => {try {const selector = "[data-site-theme-toggle]";const bind = () => {document.querySelectorAll(selector).forEach((button) => {if (button.getAttribute("data-site-theme-toggle-bound") === "true") return;button.setAttribute("data-site-theme-toggle-bound", "true");button.addEventListener("click", () => {const root = document.documentElement;const nextTheme = root.classList.contains("dark") ? "light" : "dark";localStorage.setItem(${JSON.stringify(
		SITE_THEME_STORAGE_KEY,
	)}, nextTheme);root.classList.toggle("dark", nextTheme === "dark");root.dataset.theme = nextTheme;});});};if (document.readyState === "loading") {document.addEventListener("DOMContentLoaded", bind, { once: true });} else {bind();}} catch {}})();`;
