const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const sanitizeUrl = (value: string) => {
	try {
		const url = new URL(value, "https://example.com");
		const protocol = url.protocol.toLowerCase();
		if (
			protocol === "http:" ||
			protocol === "https:" ||
			protocol === "mailto:"
		) {
			return value;
		}
	} catch {
		return "#";
	}

	return "#";
};

const renderInline = (value: string) => {
	const withCode = value.replace(/`([^`]+)`/g, "<code>$1</code>");
	const withBold = withCode.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
	const withItalic = withBold.replace(/\*([^*]+)\*/g, "<em>$1</em>");
	const withLinks = withItalic.replace(
		/\[([^\]]+)]\(([^)]+)\)/g,
		(_match, text, url) => {
			const safeUrl = sanitizeUrl(url);
			return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
		},
	);

	return withLinks;
};

export const renderMarkdown = (value: string) => {
	const escaped = escapeHtml(value);
	const paragraphs = escaped
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.replace(/\n/g, "<br />"))
		.map((paragraph) => renderInline(paragraph));

	return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
};
