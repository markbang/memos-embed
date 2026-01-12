import type {
	EmbedTheme,
	ThemeInput,
	ThemePresetName,
	ThemeTokens,
} from "./types";

const baseFonts = {
	fontFamily:
		"'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
	monoFontFamily:
		"'JetBrains Mono', 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, monospace",
};

const themeTokens: Record<ThemePresetName, ThemeTokens> = {
	minimal: {
		background: "#ffffff",
		foreground: "#0f172a",
		mutedForeground: "#475569",
		border: "#e2e8f0",
		accent: "#2563eb",
		accentForeground: "#ffffff",
		codeBackground: "#f1f5f9",
		shadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
	},
	glass: {
		background: "rgba(255, 255, 255, 0.9)",
		foreground: "#0f172a",
		mutedForeground: "#475569",
		border: "rgba(226, 232, 240, 0.7)",
		accent: "#06b6d4",
		accentForeground: "#0f172a",
		codeBackground: "rgba(15, 23, 42, 0.06)",
		shadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
	},
	paper: {
		background: "#f8fafc",
		foreground: "#1e293b",
		mutedForeground: "#64748b",
		border: "#e2e8f0",
		accent: "#7c3aed",
		accentForeground: "#ffffff",
		codeBackground: "#e2e8f0",
		shadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
	},
	midnight: {
		background: "#0f172a",
		foreground: "#e2e8f0",
		mutedForeground: "#94a3b8",
		border: "#1e293b",
		accent: "#38bdf8",
		accentForeground: "#0f172a",
		codeBackground: "#1e293b",
		shadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
	},
	terminal: {
		background: "#020617",
		foreground: "#e2e8f0",
		mutedForeground: "#94a3b8",
		border: "#1f2937",
		accent: "#22d3ee",
		accentForeground: "#020617",
		codeBackground: "#0f172a",
		shadow: "0 12px 28px rgba(2, 6, 23, 0.7)",
	},
};

export const themePresets: Record<ThemePresetName, EmbedTheme> = {
	minimal: {
		name: "minimal",
		tokens: themeTokens.minimal,
		radius: "16px",
		...baseFonts,
	},
	glass: {
		name: "glass",
		tokens: themeTokens.glass,
		radius: "18px",
		...baseFonts,
	},
	paper: {
		name: "paper",
		tokens: themeTokens.paper,
		radius: "14px",
		...baseFonts,
	},
	midnight: {
		name: "midnight",
		tokens: themeTokens.midnight,
		radius: "18px",
		...baseFonts,
	},
	terminal: {
		name: "terminal",
		tokens: themeTokens.terminal,
		radius: "12px",
		...baseFonts,
	},
};

export const defaultTheme = themePresets.minimal;

export const resolveTheme = (input?: ThemeInput): EmbedTheme => {
	if (!input) {
		return defaultTheme;
	}

	if (typeof input === "string") {
		return themePresets[input] ?? defaultTheme;
	}

	const base = input.name
		? (themePresets[input.name] ?? defaultTheme)
		: defaultTheme;

	return {
		...base,
		...input,
		tokens: {
			...base.tokens,
			...input.tokens,
		},
		name: input.name ?? base.name,
		radius: input.radius ?? base.radius,
		fontFamily: input.fontFamily ?? base.fontFamily,
		monoFontFamily: input.monoFontFamily ?? base.monoFontFamily,
	};
};
