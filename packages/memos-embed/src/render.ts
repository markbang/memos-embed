import { escapeHtml, sanitizeUrl } from "./html";
import { renderMarkdown } from "./markdown";
import { resolveTheme } from "./theme";
import type {
	EmbedHtmlOptions,
	EmbedRenderOptions,
	Memo,
	MemoAttachment,
	MemoListRenderOptions,
} from "./types";

const formatTime = (value?: string, locale?: string) => {
	if (!value) {
		return "";
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat(locale ?? "en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
};

const getDensityVars = (density: EmbedRenderOptions["density"]) => {
	if (density === "compact") {
		return {
			padding: "12px",
			gap: "10px",
			fontSize: "14px",
			avatarSize: "32px",
		};
	}

	return {
		padding: "16px",
		gap: "12px",
		fontSize: "15px",
		avatarSize: "40px",
	};
};

const buildThemeStyle = (options: EmbedRenderOptions) => {
	const theme = resolveTheme(options.theme);
	const densityVars = getDensityVars(options.density);

	return [
		`--me-background:${theme.tokens.background}`,
		`--me-foreground:${theme.tokens.foreground}`,
		`--me-muted:${theme.tokens.mutedForeground}`,
		`--me-border:${theme.tokens.border}`,
		`--me-accent:${theme.tokens.accent}`,
		`--me-accent-foreground:${theme.tokens.accentForeground}`,
		`--me-code-bg:${theme.tokens.codeBackground}`,
		`--me-shadow:${theme.tokens.shadow}`,
		`--me-radius:${theme.radius}`,
		`--me-font:${theme.fontFamily}`,
		`--me-mono-font:${theme.monoFontFamily}`,
		`--me-padding:${densityVars.padding}`,
		`--me-gap:${densityVars.gap}`,
		`--me-font-size:${densityVars.fontSize}`,
		`--me-avatar-size:${densityVars.avatarSize}`,
	].join(";");
};

const sanitizeCssLength = (value: string | undefined, fallback: string) => {
	if (!value) {
		return fallback;
	}

	const trimmed = value.trim();
	if (!trimmed) {
		return fallback;
	}

	return /^[0-9]+(?:\.[0-9]+)?(?:px|rem|em|%|vw|vh)$/.test(trimmed)
		? trimmed
		: fallback;
};

const buildMemoListStyle = (options: MemoListRenderOptions) =>
	`--me-list-gap:${sanitizeCssLength(options.gap, "16px")}`;

export const buildEmbedCss = () => `
.memos-embed-list {
  display: grid;
  gap: var(--me-list-gap, 16px);
}

.memos-embed-list--stack {
  grid-template-columns: minmax(0, 1fr);
}

.memos-embed-list--grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
}

.memos-embed {
  position: relative;
  background-color: var(--me-background, #ffffff);
  color: var(--me-foreground, #0f172a);
  border: 1px solid var(--me-border, #e2e8f0);
  border-radius: var(--me-radius, 16px);
  box-shadow: var(--me-shadow, 0 10px 30px rgba(15, 23, 42, 0.08));
  padding: var(--me-padding);
  font-family: var(--me-font);
  font-size: var(--me-font-size);
  line-height: 1.5;
  display: flex;
  flex-direction: row;
  gap: var(--me-gap);
  box-sizing: border-box;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.memos-embed *,
.memos-embed *::before,
.memos-embed *::after {
  box-sizing: inherit;
}

.memos-embed:hover {
  border-color: var(--me-accent, #2563eb);
}

.memos-embed__avatar-container {
  flex-shrink: 0;
}

.memos-embed__avatar {
  width: var(--me-avatar-size, 40px);
  height: var(--me-avatar-size, 40px);
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--me-border, #e2e8f0);
  display: block;
}

.memos-embed__avatar-fallback {
  width: var(--me-avatar-size, 40px);
  height: var(--me-avatar-size, 40px);
  border-radius: 50%;
  background-color: var(--me-code-bg, #f1f5f9);
  color: var(--me-muted, #64748b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875em;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid var(--me-border, #e2e8f0);
  user-select: none;
}

.memos-embed__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.memos-embed__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
  line-height: 1.3;
}

.memos-embed__user-name {
  font-weight: 700;
  color: var(--me-foreground, #0f172a);
}

.memos-embed__user-handle {
  color: var(--me-muted, #64748b);
  font-size: 0.95em;
}

.memos-embed__meta-sep {
  color: var(--me-muted, #64748b);
  padding: 0 2px;
  opacity: 0.6;
}

.memos-embed__time {
  color: var(--me-muted, #64748b);
  font-size: 0.95em;
  white-space: nowrap;
}

.memos-embed__state {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: var(--me-code-bg, #f1f5f9);
  color: var(--me-muted, #64748b);
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
}

.memos-embed__content {
  color: var(--me-foreground, #0f172a);
  font-size: 1em;
  word-wrap: break-word;
}

.memos-embed__content > *:first-child {
  margin-top: 0;
}

.memos-embed__content > *:last-child {
  margin-bottom: 0;
}

.memos-embed__content p,
.memos-embed__content ul,
.memos-embed__content ol,
.memos-embed__content pre,
.memos-embed__content blockquote,
.memos-embed__content hr {
  margin: 0 0 0.75em;
}

.memos-embed__content h1,
.memos-embed__content h2,
.memos-embed__content h3,
.memos-embed__content h4,
.memos-embed__content h5,
.memos-embed__content h6 {
  margin: 0.2em 0 0.5em;
  font-weight: 700;
  line-height: 1.25;
}

.memos-embed__content h1 { font-size: 1.45em; }
.memos-embed__content h2 { font-size: 1.25em; }
.memos-embed__content h3 { font-size: 1.15em; }
.memos-embed__content h4,
.memos-embed__content h5,
.memos-embed__content h6 { font-size: 1.05em; }

.memos-embed__content ul,
.memos-embed__content ol {
  padding-left: 1.4em;
}

.memos-embed__content ul[data-task-list="true"] {
  list-style: none;
  padding-left: 0;
}

.memos-embed__content li + li {
  margin-top: 0.25em;
}

.memos-embed__content .memos-embed__task-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.memos-embed__content .memos-embed__task-checkbox {
  margin-top: 0.2em;
  accent-color: var(--me-accent, #2563eb);
}

.memos-embed__content .memos-embed__task-item[data-checked="true"] span {
  color: var(--me-muted, #64748b);
  text-decoration: line-through;
}

.memos-embed__content a {
  color: var(--me-accent, #2563eb);
  text-decoration: none;
  font-weight: 500;
}

.memos-embed__content a:hover,
.memos-embed__tag:hover,
.memos-embed__attachment:hover .memos-embed__attachment-title {
  text-decoration: underline;
}

.memos-embed__content code {
  font-family: var(--me-mono-font);
  background-color: var(--me-code-bg, #f1f5f9);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.875em;
}

.memos-embed__content pre {
  position: relative;
  font-family: var(--me-mono-font);
  background-color: var(--me-code-bg, #f1f5f9);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875em;
}

.memos-embed__content pre[data-language] {
  padding-top: 28px;
}

.memos-embed__content pre[data-language]::before {
  content: attr(data-language);
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 0.72em;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--me-muted, #64748b);
}

.memos-embed__content pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
}

.memos-embed__content blockquote {
  border-left: 3px solid var(--me-border, #e2e8f0);
  padding-left: 12px;
  color: var(--me-muted, #64748b);
}

.memos-embed__content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 0.5em 0;
  border: 1px solid var(--me-border, #e2e8f0);
}

.memos-embed__content hr {
  border: 0;
  border-top: 1px solid var(--me-border, #e2e8f0);
}

.memos-embed__attachments {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.memos-embed__attachment {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--me-border, #e2e8f0);
  border-radius: 10px;
  background-color: transparent;
  color: var(--me-foreground, #0f172a);
  text-decoration: none;
  transition: all 0.2s ease;
}

.memos-embed__attachment:hover {
  border-color: var(--me-accent, #2563eb);
  background-color: var(--me-code-bg, #f1f5f9);
}

.memos-embed__attachment-preview {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--me-border, #e2e8f0);
  flex-shrink: 0;
}

.memos-embed__attachment-icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background-color: var(--me-code-bg, #f1f5f9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.memos-embed__attachment-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.memos-embed__attachment-title {
  font-size: 0.92em;
  font-weight: 600;
  color: inherit;
  word-break: break-word;
}

.memos-embed__attachment-meta {
  font-size: 0.8em;
  color: var(--me-muted, #64748b);
  margin-top: 2px;
}

.memos-embed__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.memos-embed__tags,
.memos-embed__reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.memos-embed__tag {
  font-family: var(--me-mono-font);
  color: var(--me-accent, #2563eb);
  font-size: 0.875em;
  text-decoration: none;
}

.memos-embed__reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: var(--me-code-bg, #f1f5f9);
  border-radius: 12px;
  font-size: 0.85em;
  color: var(--me-muted, #64748b);
  user-select: none;
}

.memos-embed__reaction-count {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
`;

const imageExtensions = [
	".avif",
	".gif",
	".jpeg",
	".jpg",
	".png",
	".svg",
	".webp",
];

const isImageAttachment = (attachment: MemoAttachment) => {
	const type = attachment.type?.toLowerCase();
	if (type?.startsWith("image/")) {
		return true;
	}

	const candidate = (
		attachment.filename ??
		attachment.externalLink ??
		attachment.content ??
		attachment.name
	).toLowerCase();

	return imageExtensions.some((extension) => candidate.includes(extension));
};

const renderTags = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showTags === false || memo.tags.length === 0) {
		return "";
	}

	const tags = memo.tags
		.map(
			(tag) =>
				`<span class="memos-embed__tag" part="tag">#${escapeHtml(tag)}</span>`,
		)
		.join("");

	return `<div class="memos-embed__tags" part="tags">${tags}</div>`;
};

const renderAttachmentLink = (
	content: string,
	href: string,
	options: EmbedRenderOptions,
) => {
	if (href === "#") {
		return `<div class="memos-embed__attachment" part="attachment">${content}</div>`;
	}

	const target = options.linkTarget ?? "_blank";
	const rel = target === "_blank" ? ' rel="noopener noreferrer"' : "";
	return `<a class="memos-embed__attachment" part="attachment" href="${escapeHtml(
		href,
	)}" target="${target}"${rel}>${content}</a>`;
};

const renderAttachments = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showAttachments === false || memo.attachments.length === 0) {
		return "";
	}

	const attachments = memo.attachments
		.map((attachment) => {
			const label = escapeHtml(attachment.filename ?? attachment.name ?? "Attachment");
			const href = sanitizeUrl(
				attachment.externalLink ?? attachment.content ?? undefined,
			);
			const previewUrl = isImageAttachment(attachment)
				? sanitizeUrl(attachment.externalLink ?? attachment.content)
				: "#";
			const metaParts = [attachment.type, attachment.size]
				.filter(Boolean)
				.map((part) => escapeHtml(part ?? ""))
				.filter(Boolean);
			const body = `${
				previewUrl !== "#"
					? `<img class="memos-embed__attachment-preview" part="attachment-preview" src="${escapeHtml(
						previewUrl,
					)}" alt="${label}" loading="lazy" />`
					: '<span class="memos-embed__attachment-icon" part="attachment-icon">📎</span>'
			}<span class="memos-embed__attachment-body"><span class="memos-embed__attachment-title">${label}</span>${
				metaParts.length > 0
					? `<span class="memos-embed__attachment-meta">${metaParts.join(" · ")}</span>`
					: ""
			}</span>`;

			return renderAttachmentLink(body, href, options);
		})
		.join("");

	return `<div class="memos-embed__attachments" part="attachments">${attachments}</div>`;
};

const renderReactions = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showReactions === false || memo.reactions.length === 0) {
		return "";
	}

	const counts = new Map<string, number>();
	for (const reaction of memo.reactions) {
		const label = reaction.reactionType ?? "Reaction";
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}

	const reactions = Array.from(counts.entries())
		.map(([label, count]) => {
			const safeLabel = escapeHtml(label);
			const suffix =
				count > 1
					? `<span class="memos-embed__reaction-count">${count}</span>`
					: "";
			return `<span class="memos-embed__reaction" part="reaction">${safeLabel}${suffix}</span>`;
		})
		.join("");

	return `<div class="memos-embed__reactions" part="reactions">${reactions}</div>`;
};

const renderAvatar = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showMeta === false) {
		return "";
	}

	const creatorName = memo.creatorDisplayName || memo.creatorUsername || memo.creator || "user";
	const avatarUrl = memo.creatorAvatarUrl
		? sanitizeUrl(memo.creatorAvatarUrl)
		: "#";

	if (avatarUrl !== "#") {
		return `<img class="memos-embed__avatar" part="avatar" src="${escapeHtml(
			avatarUrl,
		)}" alt="${escapeHtml(creatorName)}" loading="lazy" />`;
	}

	return `<div class="memos-embed__avatar-fallback" part="avatar-fallback">${escapeHtml(
		creatorName.slice(0, 1).toUpperCase(),
	)}</div>`;
};

const renderHeader = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showMeta === false) {
		return "";
	}

	const timeLabel = formatTime(
		memo.displayTime ?? memo.createTime,
		options.locale,
	);
	const displayName = memo.creatorDisplayName
		? memo.creatorDisplayName
		: memo.creatorUsername
			? `@${memo.creatorUsername}`
			: memo.creator
				? `@${memo.creator}`
				: "user";
	const handle = memo.creatorDisplayName && memo.creatorUsername
		? `@${memo.creatorUsername}`
		: "";

	let html = `<span class="memos-embed__user-name" part="user-name">${escapeHtml(
		displayName,
	)}</span>`;

	if (handle) {
		html += `<span class="memos-embed__user-handle" part="user-handle">${escapeHtml(
			handle,
		)}</span>`;
	}

	if (timeLabel) {
		html += `<span class="memos-embed__meta-sep">·</span>`;
		html += `<span class="memos-embed__time" part="time">${escapeHtml(timeLabel)}</span>`;
	}

	return `<div class="memos-embed__header" part="header">${html}</div>`;
};

export const renderMemoHtml = (
	memo: Memo,
	options: EmbedRenderOptions = {},
) => {
	const contentHtml = renderMarkdown(memo.content, {
		linkTarget: options.linkTarget,
	});
	const themeStyle = buildThemeStyle(options);

	const avatar = renderAvatar(memo, options);
	const header = renderHeader(memo, options);
	const tags = renderTags(memo, options);
	const attachments = renderAttachments(memo, options);
	const reactions = renderReactions(memo, options);
	const footerContent = `${tags}${reactions}`;

	const leftCol = avatar
		? `<div class="memos-embed__avatar-container">${avatar}</div>`
		: "";
	const footer = footerContent
		? `<div class="memos-embed__footer" part="footer">${footerContent}</div>`
		: "";

	return `
<div class="memos-embed" part="container" style="${themeStyle}">
  ${leftCol}
  <div class="memos-embed__main">
    ${header}
    <div class="memos-embed__content" part="content">${contentHtml}</div>
    ${attachments}
    ${footer}
  </div>
</div>
  `.trim();
};

export const renderMemoListHtml = (
	memos: readonly Memo[],
	options: MemoListRenderOptions = {},
) => {
	const layout = options.layout ?? "stack";
	const listStyle = escapeHtml(buildMemoListStyle(options));
	const items = memos.map((memo) => renderMemoHtml(memo, options)).join("");

	return `<div class="memos-embed-list memos-embed-list--${layout}" style="${listStyle}">${items}</div>`;
};

const wrapHtmlSnippet = (content: string, includeStyles = true) => {
	if (!includeStyles) {
		return content;
	}

	return `<style>${buildEmbedCss()}</style>${content}`;
};

export const renderMemoHtmlSnippet = (
	memo: Memo,
	options: EmbedHtmlOptions = {},
) => wrapHtmlSnippet(renderMemoHtml(memo, options), options.includeStyles);

export const renderMemoListHtmlSnippet = (
	memos: readonly Memo[],
	options: MemoListRenderOptions = {},
) => wrapHtmlSnippet(renderMemoListHtml(memos, options), options.includeStyles);

export const renderMemoStateHtmlSnippet = (
	message: string,
	options: Pick<EmbedHtmlOptions, "includeStyles"> = {},
) =>
	wrapHtmlSnippet(
		`<div class="memos-embed__state">${escapeHtml(message)}</div>`,
		options.includeStyles,
	);
