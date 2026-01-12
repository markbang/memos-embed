declare global {
	namespace JSX {
		interface IntrinsicElements {
			"memos-embed": {
				"base-url"?: string;
				"memo-id"?: string;
				theme?: string;
				density?: string;
			};
		}
	}
}

export {};
