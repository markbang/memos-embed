declare global {
	namespace JSX {
		interface IntrinsicElements {
			"memos-embed": {
				"base-url"?: string;
				"memo-id"?: string;
				theme?: string;
				density?: string;
				locale?: string;
				"link-target"?: string;
				"include-styles"?: string;
				"show-tags"?: string;
				"show-attachments"?: string;
				"show-reactions"?: string;
				"show-meta"?: string;
			};
		}
	}
}

export {};
