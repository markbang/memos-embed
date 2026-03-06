import {
	fetchMemo,
	renderMemoHtmlSnippet,
	renderMemoStateHtmlSnippet,
	type EmbedRenderOptions,
	type ThemeInput,
} from "memos-embed";

const attributeToBoolean = (value: string | null) => {
	if (value === null) {
		return undefined;
	}
	return value === "" || value === "true";
};

const HTMLElementBase =
	(globalThis as { HTMLElement?: typeof HTMLElement }).HTMLElement ??
	(class {} as typeof HTMLElement);

export class MemosEmbedElement extends HTMLElementBase {
	static get observedAttributes() {
		return [
			"memo-id",
			"base-url",
			"theme",
			"density",
			"locale",
			"show-tags",
			"show-attachments",
			"show-reactions",
			"show-meta",
		];
	}

	private readonly shadowRootRef: ShadowRoot;

	constructor() {
		super();
		this.shadowRootRef = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		void this.render();
	}

	attributeChangedCallback() {
		void this.render();
	}

	private getRenderOptions(): EmbedRenderOptions {
		return {
			theme:
				(this.getAttribute("theme") as ThemeInput | undefined) ?? undefined,
			density:
				(this.getAttribute("density") as EmbedRenderOptions["density"]) ??
				undefined,
			locale: this.getAttribute("locale") ?? undefined,
			showTags: attributeToBoolean(this.getAttribute("show-tags")),
			showAttachments: attributeToBoolean(
				this.getAttribute("show-attachments"),
			),
			showReactions: attributeToBoolean(this.getAttribute("show-reactions")),
			showMeta: attributeToBoolean(this.getAttribute("show-meta")),
		};
	}

	private async render() {
		const memoId = this.getAttribute("memo-id");
		const baseUrl = this.getAttribute("base-url");

		if (!memoId || !baseUrl) {
			this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet(
				"Missing memo-id or base-url.",
			);
			return;
		}

		this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet("Loading memo…");

		try {
			const memo = await fetchMemo({ baseUrl, memoId });
			this.shadowRootRef.innerHTML = renderMemoHtmlSnippet(
				memo,
				this.getRenderOptions(),
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to load memo.";
			this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet(message);
		}
	}
}

export const defineMemosEmbedElement = () => {
	if (!customElements.get("memos-embed")) {
		customElements.define("memos-embed", MemosEmbedElement);
	}
};
