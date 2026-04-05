export const SITE_NAME = "Memos Embed";
export const SITE_DESCRIPTION =
	"Embeddable memo cards for Memos, available as a website, iframe, React component, and Web Component.";

type PageHeadInput = {
	title?: string;
	description: string;
};

export const getPageTitle = (title?: string) =>
	title ? `${title} · ${SITE_NAME}` : SITE_NAME;

export const buildPageHead = ({ title, description }: PageHeadInput) => {
	const pageTitle = getPageTitle(title);

	return {
		meta: [
			{ title: pageTitle },
			{ name: "description", content: description },
			{ property: "og:title", content: pageTitle },
			{ property: "og:description", content: description },
			{ property: "og:type", content: "website" },

			{ name: "twitter:title", content: pageTitle },
			{ name: "twitter:description", content: description },
			{
				property: "og:image",
				content: "https://memos-embed.vercel.app/android-chrome-512x512.png",
			},
			{
				name: "twitter:image",
				content: "https://memos-embed.vercel.app/android-chrome-512x512.png",
			},
			{ name: "twitter:card", content: "summary_large_image" },
		],
	};
};
