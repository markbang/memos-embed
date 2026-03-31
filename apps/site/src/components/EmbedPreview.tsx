import { useEffect, useRef } from "react";
import { bindEmbedAutoResize } from "@/lib/embed-resize";
import { highlightCodeBlocks } from "@/lib/highlight";

export function EmbedPreview({
	html,
	frameId,
}: {
	html: string;
	frameId?: string;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		containerRef.current.innerHTML = html;
		void highlightCodeBlocks(containerRef.current).catch(() => {});
	}, [html]);

	useEffect(() => {
		if (!containerRef.current || !frameId) {
			return;
		}
		if (typeof window === "undefined" || window.parent === window) {
			return;
		}

		return bindEmbedAutoResize({
			frameId,
			container: containerRef.current,
		});
	}, [frameId]);

	return <div ref={containerRef} />;
}
