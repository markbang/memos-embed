const identity = (v: string) => () => v;

export const m: Record<string, (...args: unknown[]) => string> = new Proxy(
	{
		current_locale: ({ locale }: { locale: string }) =>
			`Current locale: ${locale}`,
		footer_copyright: ({ year }: { year: string }) => `© ${year} Memos Embed.`,
		integration_example_link: ({ integration }: { integration: string }) =>
			`Open ${integration} example`,
	} as Record<string, (...args: unknown[]) => string>,
	{
		get(target, prop: string) {
			if (prop in target) {
				return target[prop];
			}
			return identity(prop);
		},
	},
);
