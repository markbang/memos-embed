import {
	fetchMemo,
	renderMemoHtmlSnippet,
	renderMemoStateHtmlSnippet,
	type EmbedHtmlOptions,
	type EmbedRenderOptions,
	type ThemeInput,
} from "memos-embed";

const attributeToBoolean = (value: string | null) => {
	if (value === null) {
		return undefined;
	}
	return value === "" || value === "true";
};

const attributeToLinkTarget = (value: string | null) =>
	value === "_blank" || value === "_self" ? value : undefined;

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
			"link-target",
			"include-styles",
		];
	}

	private readonly shadowRootRef: ShadowRoot;
	private abortController?: AbortController;
	private renderToken = 0;

	constructor() {
		super();
		this.shadowRootRef = this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		void this.render();
	}

	disconnectedCallback() {
		this.abortController?.abort();
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
			linkTarget: attributeToLinkTarget(this.getAttribute("link-target")),
		};
	}

	private getHtmlOptions(): EmbedHtmlOptions {
		return {
			...this.getRenderOptions(),
			includeStyles: attributeToBoolean(this.getAttribute("include-styles")),
		};
	}

	private async render() {
		const memoId = this.getAttribute("memo-id");
		const baseUrl = this.getAttribute("base-url");

		if (!memoId || !baseUrl) {
			this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet(
				"Missing memo-id or base-url.",
				{ includeStyles: attributeToBoolean(this.getAttribute("include-styles")) },
			);
			return;
		}

		this.abortController?.abort();
		const controller = new AbortController();
		this.abortController = controller;
		const currentToken = ++this.renderToken;

		this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet("Loading memo…", {
			includeStyles: attributeToBoolean(this.getAttribute("include-styles")),
		});

		try {
			const memo = await fetchMemo({
				baseUrl,
				memoId,
				signal: controller.signal,
			});
			if (controller.signal.aborted || currentToken !== this.renderToken) {
				return;
			}
			this.shadowRootRef.innerHTML = renderMemoHtmlSnippet(
				memo,
				this.getHtmlOptions(),
			);
		} catch (error) {
			if (controller.signal.aborted || currentToken !== this.renderToken) {
				return;
			}
			const message =
				error instanceof Error ? error.message : "Failed to load memo.";
			this.shadowRootRef.innerHTML = renderMemoStateHtmlSnippet(message, {
				includeStyles: attributeToBoolean(this.getAttribute("include-styles")),
			});
		}
	}
}

export const defineMemosEmbedElement = () => {
	if (!customElements.get("memos-embed")) {
		customElements.define("memos-embed", MemosEmbedElement);
	}
};
