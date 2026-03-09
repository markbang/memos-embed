import { notFound } from "next/navigation";
import { MemoEmbedCard } from "@/app/components/MemoEmbedCard";
import { getBlogMemo } from "@/lib/memos";

const posts = {
	"shipping-week-note": {
		title: "Shipping week note",
		memoId: "1",
	},
} as const;

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: keyof typeof posts }>;
}) {
	const { slug } = await params;
	const post = posts[slug];

	if (!post) {
		notFound();
	}

	const memo = await getBlogMemo(post.memoId);

	return (
		<article className="prose mx-auto py-12 dark:prose-invert">
			<h1>{post.title}</h1>
			<p>
				This page fetches memo data on the server, then passes it to the React
				wrapper so the browser does not need to make a second request.
			</p>
			<MemoEmbedCard memo={memo} />
		</article>
	);
}
