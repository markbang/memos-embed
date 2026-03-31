import { type ClassValue, clsx } from "clsx";

const displayClasses = new Set([
	"block",
	"inline",
	"inline-block",
	"flex",
	"inline-flex",
	"grid",
	"inline-grid",
	"table",
	"inline-table",
	"flow-root",
	"contents",
	"hidden",
]);

const getTextSizeGroup = (token: string) =>
	/^text-(xs|sm|base|lg|xl|[2-9]xl)$/.test(token) ? "text-size" : undefined;

const getUtilityGroup = (token: string) => {
	if (displayClasses.has(token)) {
		return "display";
	}
	if (token.startsWith("w-")) {
		return "width";
	}
	if (token.startsWith("gap-")) {
		return "gap";
	}
	if (token.startsWith("bg-")) {
		return "background";
	}
	if (token === "shadow" || token.startsWith("shadow-")) {
		return "shadow";
	}

	return getTextSizeGroup(token);
};

const splitVariants = (token: string) => {
	const segments: string[] = [];
	let bracketDepth = 0;
	let parenDepth = 0;
	let current = "";

	for (const char of token) {
		if (char === "[") {
			bracketDepth += 1;
		} else if (char === "]") {
			bracketDepth = Math.max(0, bracketDepth - 1);
		} else if (char === "(") {
			parenDepth += 1;
		} else if (char === ")") {
			parenDepth = Math.max(0, parenDepth - 1);
		}

		if (char === ":" && bracketDepth === 0 && parenDepth === 0) {
			segments.push(current);
			current = "";
			continue;
		}

		current += char;
	}

	segments.push(current);
	return segments;
};

const getMergeKey = (token: string) => {
	const normalizedToken = token.startsWith("!") ? token.slice(1) : token;
	const segments = splitVariants(normalizedToken);
	const utility = segments.at(-1);
	if (!utility) {
		return undefined;
	}

	const group = getUtilityGroup(utility);
	if (!group) {
		return undefined;
	}

	const modifiers = segments.slice(0, -1).join(":");
	return `${modifiers}|${group}`;
};

export function cn(...inputs: ClassValue[]) {
	const mergedTokens: string[] = [];
	const className = clsx(inputs);
	if (!className) {
		return "";
	}

	const tokenIndexes = new Map<string, number>();
	for (const token of className.split(/\s+/)) {
		if (!token) {
			continue;
		}

		const mergeKey = getMergeKey(token);
		if (mergeKey) {
			const previousIndex = tokenIndexes.get(mergeKey);
			if (previousIndex !== undefined) {
				mergedTokens[previousIndex] = "";
			}
			tokenIndexes.set(mergeKey, mergedTokens.length);
		}

		mergedTokens.push(token);
	}

	return mergedTokens.filter(Boolean).join(" ");
}
