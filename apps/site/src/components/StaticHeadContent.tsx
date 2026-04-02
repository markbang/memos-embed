import { useRouter, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

type ManagedTag =
	| {
			tag: "title";
			children: string;
	  }
	| {
			tag: "meta" | "link";
			attrs: Record<string, unknown>;
	  };

const renderManagedTag = (tag: ManagedTag, index: number) => {
	const key = `static-head-${tag.tag}-${index}`;

	switch (tag.tag) {
		case "title":
			return <title key={key}>{tag.children}</title>;
		case "meta":
			return <meta key={key} {...tag.attrs} />;
		case "link":
			return <link key={key} {...tag.attrs} />;
	}
};

export default function StaticHeadContent() {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const routeMeta = useRouterState({
		select: (state) =>
			state.matches.map((match) => match.meta).filter(Boolean) as Array<
				Array<Record<string, unknown>>
			>,
	});

	const meta = useMemo<ManagedTag[]>(() => {
		const resultMeta: ManagedTag[] = [];
		const metaByAttribute: Record<string, true> = {};
		let title: ManagedTag | undefined;

		for (let i = routeMeta.length - 1; i >= 0; i--) {
			const metas = routeMeta[i];
			for (let j = metas.length - 1; j >= 0; j--) {
				const currentMeta = metas[j] as Record<string, unknown> & {
					title?: string;
					name?: string;
					property?: string;
				};

				if (currentMeta.title) {
					if (!title) {
						title = {
							tag: "title",
							children: currentMeta.title,
						};
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
				.flatMap((match) => match.links ?? [])
				.filter(Boolean)
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
				.flatMap(
					(match) => router.ssr?.manifest?.routes[match.routeId]?.assets ?? [],
				)
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

	return <>{[...meta, ...links].map(renderManagedTag)}</>;
}
