export type MemoVisibility =
	| "VISIBILITY_UNSPECIFIED"
	| "PRIVATE"
	| "PROTECTED"
	| "PUBLIC";

export type MemoState = "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";

export type MemoAttachment = {
	name: string;
	createTime?: string;
	filename?: string;
	content?: string;
	externalLink?: string;
	type?: string;
	size?: string;
	memo?: string;
};

export type MemoRelation = {
	memo?: { name?: string; snippet?: string };
	relatedMemo?: { name?: string; snippet?: string };
	type?: string;
};

export type MemoReaction = {
	name: string;
	creator?: string;
	contentId?: string;
	reactionType?: string;
	createTime?: string;
};

export type MemoProperty = {
	hasLink?: boolean;
	hasTaskList?: boolean;
	hasCode?: boolean;
	hasIncompleteTasks?: boolean;
};

export type MemoLocation = {
	placeholder?: string;
	latitude?: number;
	longitude?: number;
};

export type MemoApiResponse = {
	name: string;
	state?: MemoState;
	creator?: string;
	createTime?: string;
	updateTime?: string;
	displayTime?: string;
	content?: string;
	visibility?: MemoVisibility;
	tags?: string[];
	pinned?: boolean;
	attachments?: MemoAttachment[];
	relations?: MemoRelation[];
	reactions?: MemoReaction[];
	property?: MemoProperty;
	parent?: string;
	snippet?: string;
	location?: MemoLocation;
};

export type Memo = {
	id: string;
	name: string;
	creator?: string;
	creatorDisplayName?: string;
	creatorUsername?: string;
	creatorAvatarUrl?: string;
	createTime?: string;
	updateTime?: string;
	displayTime?: string;
	content: string;
	visibility?: MemoVisibility;
	tags: string[];
	pinned?: boolean;
	attachments: MemoAttachment[];
	reactions: MemoReaction[];
	snippet?: string;
};

export type EmbedDensity = "compact" | "comfortable";

export type ThemePresetName =
	| "minimal"
	| "glass"
	| "paper"
	| "midnight"
	| "terminal";

export type ThemeTokens = {
	background: string;
	foreground: string;
	mutedForeground: string;
	border: string;
	accent: string;
	accentForeground: string;
	codeBackground: string;
	shadow: string;
};

export type EmbedTheme = {
	name: ThemePresetName;
	tokens: ThemeTokens;
	radius: string;
	fontFamily: string;
	monoFontFamily: string;
};

export type ThemeInput = ThemePresetName | Partial<EmbedTheme>;

export type FetchMemoOptions = {
	baseUrl: string;
	memoId: string;
	includeCreator?: boolean;
	fetcher?: typeof fetch;
	signal?: AbortSignal;
};

export type UserApiResponse = {
	name: string;
	username?: string;
	displayName?: string;
	avatarUrl?: string;
};

export type User = {
	id: string;
	name: string;
	username?: string;
	displayName?: string;
	avatarUrl?: string;
};

export type EmbedRenderOptions = {
	locale?: string;
	density?: EmbedDensity;
	theme?: ThemeInput;
	showTags?: boolean;
	showAttachments?: boolean;
	showReactions?: boolean;
	showMeta?: boolean;
	linkTarget?: "_blank" | "_self";
};

export type EmbedHtmlOptions = EmbedRenderOptions & {
	includeStyles?: boolean;
};

export type IframeEmbedOptions = {
	embedBaseUrl: string;
	baseUrl: string;
	memoId: string;
	theme?: ThemeInput;
	density?: EmbedDensity;
	width?: number | string;
	height?: number | string;
	title?: string;
};
