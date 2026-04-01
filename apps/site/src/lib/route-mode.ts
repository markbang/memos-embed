const localeSegments = new Set(["en", "de", "zh"]);

export const normalizeSitePath = (pathname: string) => {
	const segments = pathname.split("/").filter(Boolean);
	const normalizedSegments =
		segments.length > 0 && localeSegments.has(segments[0] ?? "")
			? segments.slice(1)
			: segments;
	const normalizedPath = `/${normalizedSegments.join("/")}`.replace(/\/+$/, "");

	return normalizedPath === "" ? "/" : normalizedPath;
};

export const isStaticMarketingPath = (pathname: string) => {
	const normalizedPath = normalizeSitePath(pathname);
	return normalizedPath === "/" || normalizedPath === "/docs";
};

export const shouldHydrateSitePath = (pathname: string) => {
	return !isStaticMarketingPath(pathname);
};
