export const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");

export const sanitizeUrl = (value?: string) => {
	if (!value) {
		return "#";
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return "#";
	}

	try {
		const url = new URL(trimmed, "https://example.com");
		const protocol = url.protocol.toLowerCase();
		if (
			protocol === "http:" ||
			protocol === "https:" ||
			protocol === "mailto:"
		) {
			return trimmed;
		}
	} catch {
		return "#";
	}

	return "#";
};
