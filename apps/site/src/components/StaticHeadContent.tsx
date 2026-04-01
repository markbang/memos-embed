import { useMemo } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

type ManagedTag = {
	tag: "title" | "meta" | "link" | "style" | "script";
	attrs?: Record<string, unknown>;
	children?: string;
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");

const renderManagedTag = (tag: ManagedTag, index: number) => {
	const key = `static-head-${tag.tag}-${index}`;
	const attrs = tag.attrs ?? {};

	switch (tag.tag) {
		case "title":
			return <title key={key}>{tag.children}</title>;
		case "meta":
			return <meta key={key} {...attrs} />;
		case "link":
			return <link key={key} {...attrs} />;
		case "style":
			return tag.children ? (
				<style
					key={key}
					{...attrs}
					dangerouslySetInnerHTML={{ __html: tag.children }}
				/>
			) : (
				<style key={key} {...attrs} />
			);
		case "script":
			return tag.children ? (
				<script
					key={key}
					{...attrs}
					dangerouslySetInnerHTML={{ __html: tag.children }}
				/>
			) : (
				<script key={key} {...attrs} />
			);
	}
};

export default function StaticHeadContent() {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const routeMeta = useRouterState({
		select: (state) => state.matches.map((match) => match.meta!).filter(Boolean),
	});

	const meta = useMemo<ManagedTag[]>(() => {
		const resultMeta: ManagedTag[] = [];
		const metaByAttribute: Record<string, true> = {};
		let title: ManagedTag | undefined;

		for (let i = routeMeta.length - 1; i >= 0; i--) {
			const metas = routeMeta[i];
			for (let j = metas.length - 1; j >= 0; j--) {
				const currentMeta = metas[j];
				if (!currentMeta) {
					continue;
				}

				if (currentMeta.title) {
					if (!title) {
						title = {
							tag: "title",
							children: currentMeta.title,
						};
					}
					continue;
				}

				if ("script:ld+json" in currentMeta) {
					try {
						resultMeta.push({
							tag: "script",
							attrs: {
								type: "application/ld+json",
							},
							children: escapeHtml(JSON.stringify(currentMeta["script:ld+json"])),
						});
					} catch {
						// Ignore invalid structured data payloads.
					}
					continue;
				}

				const attribute = currentMeta.name ?? currentMeta.property;
				if (attribute) {
					if (metaByAttribute[attribute]) {
						continue;
					}
					metaByAttribute[attribute] = true;
				}

				resultMeta.push({
					tag: "meta",
					attrs: {
						...currentMeta,
						nonce,
					},
				});
			}
		}

		if (title) {
			resultMeta.push(title);
		}

		if (nonce) {
			resultMeta.push({
				tag: "meta",
				attrs: {
					property: "csp-nonce",
					content: nonce,
				},
			});
		}

		resultMeta.reverse();
		return resultMeta;
	}, [nonce, routeMeta]);

	const links = useRouterState({
		select: (state) => {
			const constructed = state.matches
				.map((match) => match.links!)
				.filter(Boolean)
				.flat(1)
				.map(
					(link) =>
						({
							tag: "link",
							attrs: {
								...link,
								nonce,
							},
						}) satisfies ManagedTag,
				);

			const assets = state.matches
				.map((match) => router.ssr?.manifest?.routes[match.routeId]?.assets ?? [])
				.filter(Boolean)
				.flat(1)
				.filter((asset) => asset.tag === "link")
				.map(
					(asset) =>
						({
							tag: "link",
							attrs: {
								...asset.attrs,
								suppressHydrationWarning: true,
								nonce,
							},
						}) satisfies ManagedTag,
				);

			return [...constructed, ...assets];
		},
		structuralSharing: true as never,
	});

	const styles = useRouterState({
		select: (state) =>
			(
				state.matches
					.map((match) => match.styles!)
					.flat(1)
					.filter(Boolean) as Array<Record<string, unknown> & { children?: string }>
			).map(({ children, ...attrs }) => ({
				tag: "style",
				attrs: {
					...attrs,
					nonce,
				},
				children,
			})),
		structuralSharing: true as never,
	});

	const tags = [...meta, ...links, ...styles];

	return <>{tags.map(renderManagedTag)}</>;
}
