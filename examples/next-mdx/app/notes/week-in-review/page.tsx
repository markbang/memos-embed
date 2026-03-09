import { fetchMemos } from "memos-embed";
import { MemoRoundupHtml } from "@/app/components/MemoRoundupHtml";

export default async function WeekInReviewPage() {
	const memos = await fetchMemos({
		baseUrl: process.env.MEMOS_BASE_URL ?? "https://demo.usememos.com/api/v1",
		memoIds: ["1", "2", "3"],
	});

	return (
		<article className="prose mx-auto py-12 dark:prose-invert">
			<h1>Week in review</h1>
			<p>
				This page renders several memos at once with a shared style block, which
				works well for weekly notes, reading digests, and changelog roundups.
			</p>
			<MemoRoundupHtml memos={memos} />
		</article>
	);
}
