declare global {
	namespace JSX {
		interface IntrinsicElements {
			"memos-embed": {
				"base-url"?: string;
				"memo-id"?: string;
				theme?: string;
				density?: string;
				"show-tags"?: string;
				"show-attachments"?: string;
				"show-reactions"?: string;
				"show-meta"?: string;
			};
		}
	}
}

export {};
