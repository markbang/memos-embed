import type { EmbedHtmlOptions, EmbedRenderOptions, Memo } from "./types";
import { renderMarkdown } from "./markdown";
import { resolveTheme } from "./theme";

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

export const buildEmbedCss = () => `
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

/* Left Column (Avatar) */
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

/* Right Column (Main) */
.memos-embed__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Header */
.memos-embed__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 2px;
  line-height: 1.3;
}

.memos-embed__user-name {
  font-weight: 700;
  color: var(--me-foreground, #0f172a);
  margin-right: 2px;
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

.memos-embed__time:hover,
.memos-embed__user-handle:hover {
  text-decoration: underline;
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
  margin-left: 6px;
}

/* Content */
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

.memos-embed__content p {
  margin: 0 0 0.5em;
}

.memos-embed__content a {
  color: var(--me-accent, #2563eb);
  text-decoration: none;
  font-weight: 500;
}

.memos-embed__content a:hover {
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
  font-family: var(--me-mono-font);
  background-color: var(--me-code-bg, #f1f5f9);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875em;
  margin: 0.5em 0;
}

.memos-embed__content blockquote {
  border-left: 3px solid var(--me-border, #e2e8f0);
  padding-left: 12px;
  margin: 0.5em 0;
  color: var(--me-muted, #64748b);
  font-style: italic;
}

.memos-embed__content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 0.5em 0;
  border: 1px solid var(--me-border, #e2e8f0);
}

/* Attachments */
.memos-embed__attachments {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.memos-embed__attachment {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--me-border, #e2e8f0);
  border-radius: 8px;
  background-color: transparent;
  color: var(--me-foreground, #0f172a);
  text-decoration: none;
  font-size: 0.875em;
  transition: all 0.2s ease;
}

.memos-embed__attachment:hover {
  border-color: var(--me-accent, #2563eb);
  background-color: var(--me-code-bg, #f1f5f9);
  color: var(--me-accent, #2563eb);
}

/* Footer (Tags & Reactions) */
.memos-embed__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.memos-embed__tags {
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

.memos-embed__tag:hover {
  text-decoration: underline;
}

.memos-embed__reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.memos-embed__reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  background-color: var(--me-code-bg, #f1f5f9);
  border-radius: 12px;
  font-size: 0.85em;
  color: var(--me-muted, #64748b);
  user-select: none;
}
`;

const renderTags = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showTags === false || memo.tags.length === 0) {
		return "";
	}

	const tags = memo.tags
		.map((tag) => `<span class="memos-embed__tag" part="tag">#${tag}</span>`)
		.join("");

	return `<div class="memos-embed__tags" part="tags">${tags}</div>`;
};

const renderAttachments = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showAttachments === false || memo.attachments.length === 0) {
		return "";
	}

	const attachments = memo.attachments
		.map((attachment) => {
			const label = attachment.filename ?? attachment.name;
			const href = attachment.externalLink ?? attachment.content ?? "#";
			return `<a class="memos-embed__attachment" part="attachment" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
		})
		.join("");

	return `<div class="memos-embed__attachments" part="attachments">${attachments}</div>`;
};

const renderReactions = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showReactions === false || memo.reactions.length === 0) {
		return "";
	}

	const reactions = memo.reactions
		.map((reaction) => {
			const label = reaction.reactionType ?? "Reaction";
			return `<span class="memos-embed__reaction" part="reaction">${label}</span>`;
		})
		.join("");

	return `<div class="memos-embed__reactions" part="reactions">${reactions}</div>`;
};

const renderAvatar = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showMeta === false) {
		return "";
	}

	const creatorName = memo.creatorUsername || memo.creator || "user";

	if (memo.creatorAvatarUrl) {
		return `<img class="memos-embed__avatar" part="avatar" src="${memo.creatorAvatarUrl}" alt="${creatorName}" loading="lazy" />`;
	}

	return `<div class="memos-embed__avatar-fallback" part="avatar-fallback">${creatorName.slice(0, 1)}</div>`;
};

const renderHeader = (memo: Memo, options: EmbedRenderOptions) => {
	if (options.showMeta === false) {
		return "";
	}

	const timeLabel = formatTime(
		memo.displayTime ?? memo.createTime,
		options.locale,
	);
	const displayName = memo.creatorUsername || memo.creator || "user";

	let html = `<span class="memos-embed__user-name" part="user-name">@${displayName}</span>`;

	html += `<span class="memos-embed__meta-sep">·</span>`;
	html += `<span class="memos-embed__time" part="time">${timeLabel}</span>`;

	return `<div class="memos-embed__header" part="header">${html}</div>`;
};

export const renderMemoHtml = (
	memo: Memo,
	options: EmbedRenderOptions = {},
) => {
	const contentHtml = renderMarkdown(memo.content);
	const themeStyle = buildThemeStyle(options);

	const avatar = renderAvatar(memo, options);
	const header = renderHeader(memo, options);
	const tags = renderTags(memo, options);
	const attachments = renderAttachments(memo, options);
	const reactions = renderReactions(memo, options);

	const leftCol = avatar
		? `<div class="memos-embed__avatar-container">${avatar}</div>`
		: "";

	return `
<div class="memos-embed" part="container" style="${themeStyle}">
  ${leftCol}
  <div class="memos-embed__main">
    ${header}
    <div class="memos-embed__content" part="content">${contentHtml}</div>
    ${attachments}
    <div class="memos-embed__footer" part="footer">
      ${tags}
      ${reactions}
    </div>
  </div>
</div>
  `.trim();
};

export const renderMemoHtmlSnippet = (
	memo: Memo,
	options: EmbedHtmlOptions = {},
) => {
	const content = renderMemoHtml(memo, options);
	if (!options.includeStyles) {
		return content;
	}

	return `<style>${buildEmbedCss()}</style>${content}`;
};
