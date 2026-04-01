import { Check, ChevronDown, Copy, Share2 } from "lucide-react";
import { type ThemePresetName, themePresets } from "memos-embed";
import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	buildEmbedPreviewUrl,
	buildIframeCode,
	buildReactCode,
	buildShareUrl,
	buildWebComponentCode,
	type PlaygroundState,
} from "@/lib/playground";

export type PlaygroundExperienceProps = {
	initialState: PlaygroundState;
	embedBaseUrl: string;
	onStateChange?: (state: PlaygroundState) => void;
	registerWebComponent?: () => Promise<void> | void;
};

type SelectOption<T extends string> = {
	value: T;
	label: string;
};

const PlaygroundReactPreview = lazy(() =>
	import("@/components/PlaygroundReactPreview").then((mod) => ({
		default: mod.PlaygroundReactPreview,
	})),
);

const themeOptions: SelectOption<ThemePresetName>[] = (
	Object.keys(themePresets) as ThemePresetName[]
).map((value) => ({
	value,
	label: themePresets[value].name,
}));

const densityOptions: SelectOption<"comfortable" | "compact">[] = [
	{ value: "comfortable", label: "Comfortable" },
	{ value: "compact", label: "Compact" },
];

const linkTargetOptions: SelectOption<"_blank" | "_self">[] = [
	{ value: "_blank", label: "New tab" },
	{ value: "_self", label: "Same tab" },
];

export function PlaygroundExperience({
	initialState,
	embedBaseUrl,
	onStateChange,
	registerWebComponent,
}: PlaygroundExperienceProps) {
	const [state, setState] = useState<PlaygroundState>(initialState);
	const [copiedKey, setCopiedKey] = useState<string | null>(null);
	const [previewTab, setPreviewTab] = useState<"iframe" | "wc" | "react">(
		"iframe",
	);
	const copyTimeoutRef = useRef<number | null>(null);
	const hasRegisteredWebComponentRef = useRef(false);

	const baseUrlId = useId();
	const memoIdId = useId();
	const themeId = useId();
	const densityId = useId();
	const linkTargetId = useId();
	const showMetaId = useId();
	const showTagsId = useId();
	const showAttachmentsId = useId();
	const showReactionsId = useId();

	useEffect(() => {
		setState(initialState);
	}, [initialState]);

	useEffect(() => {
		return () => {
			if (copyTimeoutRef.current !== null) {
				window.clearTimeout(copyTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (
			previewTab !== "wc" ||
			hasRegisteredWebComponentRef.current ||
			!registerWebComponent
		) {
			return;
		}

		hasRegisteredWebComponentRef.current = true;
		void registerWebComponent();
	}, [previewTab, registerWebComponent]);

	useEffect(() => {
		onStateChange?.(state);
	}, [onStateChange, state]);

	const previewUrl = embedBaseUrl
		? buildEmbedPreviewUrl(embedBaseUrl, state)
		: "";
	const effectiveEmbedBaseUrl = embedBaseUrl || "https://your-embed-site.com";
	const shareUrl = embedBaseUrl ? buildShareUrl(embedBaseUrl, state) : "";

	const iframeCode = buildIframeCode(effectiveEmbedBaseUrl, state);
	const webComponentCode = buildWebComponentCode(state);
	const reactCode = buildReactCode(state);

	const handleCopy = async (key: string, value: string) => {
		if (typeof navigator === "undefined" || !navigator.clipboard) {
			return;
		}

		await navigator.clipboard.writeText(value);
		setCopiedKey(key);
		if (copyTimeoutRef.current !== null) {
			window.clearTimeout(copyTimeoutRef.current);
		}
		copyTimeoutRef.current = window.setTimeout(() => {
			setCopiedKey((current) => (current === key ? null : current));
		}, 1500);
	};

	const renderCopyButton = (key: string, value: string, label: string) => (
		<Button
			type="button"
			variant="outline"
			size="sm"
			aria-label={`Copy ${label}`}
			onClick={() => void handleCopy(key, value)}
		>
			{copiedKey === key ? (
				<Check className="size-4" />
			) : (
				<Copy className="size-4" />
			)}
			{copiedKey === key ? "Copied" : "Copy"}
		</Button>
	);

	const webComponentProps = {
		"base-url": state.baseUrl,
		"memo-id": state.memoId,
		theme: state.theme,
		density: state.density,
		"link-target": state.linkTarget,
		"show-tags": String(state.showTags),
		"show-attachments": String(state.showAttachments),
		"show-reactions": String(state.showReactions),
		"show-meta": String(state.showMeta),
	};

	return (
		<div className="container mx-auto px-4 py-10">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Configuration</CardTitle>
							<CardDescription>
								Customize the memo source, theme, density, link behavior, and
								what metadata is visible.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor={baseUrlId}>Base URL</Label>
								<Input
									id={baseUrlId}
									value={state.baseUrl}
									onChange={(event) =>
										setState((current) => ({
											...current,
											baseUrl: event.target.value,
										}))
									}
									placeholder="https://demo.usememos.com/api/v1"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={memoIdId}>Memo ID</Label>
								<Input
									id={memoIdId}
									value={state.memoId}
									onChange={(event) =>
										setState((current) => ({
											...current,
											memoId: event.target.value,
										}))
									}
									placeholder="1"
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor={themeId}>Theme</Label>
									<SelectField
										id={themeId}
										value={state.theme}
										options={themeOptions}
										onValueChange={(value) =>
											setState((current) => ({
												...current,
												theme: value,
											}))
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={densityId}>Density</Label>
									<SelectField
										id={densityId}
										value={state.density}
										options={densityOptions}
										onValueChange={(value) =>
											setState((current) => ({
												...current,
												density: value,
											}))
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor={linkTargetId}>Link target</Label>
									<SelectField
										id={linkTargetId}
										value={state.linkTarget}
										options={linkTargetOptions}
										onValueChange={(value) =>
											setState((current) => ({
												...current,
												linkTarget: value,
											}))
										}
									/>
								</div>
							</div>

							<div className="space-y-3">
								<div>
									<h3 className="text-sm font-medium">Visibility</h3>
									<p className="text-sm text-muted-foreground">
										Choose which pieces of memo context should be rendered.
									</p>
								</div>
								<div className="grid gap-3 sm:grid-cols-2">
									<ToggleRow
										id={showMetaId}
										label="Meta"
										description="Author, avatar, and time"
										checked={state.showMeta}
										onCheckedChange={(checked) =>
											setState((current) => ({ ...current, showMeta: checked }))
										}
									/>
									<ToggleRow
										id={showTagsId}
										label="Tags"
										description="Hashtags under the content"
										checked={state.showTags}
										onCheckedChange={(checked) =>
											setState((current) => ({ ...current, showTags: checked }))
										}
									/>
									<ToggleRow
										id={showAttachmentsId}
										label="Attachments"
										description="Images and files"
										checked={state.showAttachments}
										onCheckedChange={(checked) =>
											setState((current) => ({
												...current,
												showAttachments: checked,
											}))
										}
									/>
									<ToggleRow
										id={showReactionsId}
										label="Reactions"
										description="Emoji counts and engagement"
										checked={state.showReactions}
										onCheckedChange={(checked) =>
											setState((current) => ({
												...current,
												showReactions: checked,
											}))
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<CardTitle>Shareable Playground URL</CardTitle>
								<CardDescription>
									Save the current configuration to a link you can share.
								</CardDescription>
							</div>
							{shareUrl
								? renderCopyButton("share", shareUrl, "share URL")
								: null}
						</CardHeader>
						<CardContent className="space-y-3">
							<Input
								readOnly
								aria-label="Share URL"
								value={shareUrl}
								placeholder="Share URL will appear here"
							/>
							<p className="flex items-center gap-2 text-sm text-muted-foreground">
								<Share2 className="size-4" />
								The playground keeps your current theme, density, and visibility
								settings in the URL.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Code Snippets</CardTitle>
							<CardDescription>
								Copy the code to embed in your site.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="iframe">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="iframe">Iframe</TabsTrigger>
									<TabsTrigger value="wc">Web Component</TabsTrigger>
									<TabsTrigger value="react">React</TabsTrigger>
								</TabsList>
								<TabsContent value="iframe" className="space-y-3">
									<div className="flex justify-end">
										{renderCopyButton("iframe", iframeCode, "iframe code")}
									</div>
									<Textarea
										readOnly
										aria-label="Iframe embed code"
										value={iframeCode}
										className="h-36 font-mono text-xs"
									/>
								</TabsContent>
								<TabsContent value="wc" className="space-y-3">
									<div className="flex justify-end">
										{renderCopyButton(
											"wc",
											webComponentCode,
											"web component code",
										)}
									</div>
									<Textarea
										readOnly
										aria-label="Web Component embed code"
										value={webComponentCode}
										className="h-40 font-mono text-xs"
									/>
								</TabsContent>
								<TabsContent value="react" className="space-y-3">
									<div className="flex justify-end">
										{renderCopyButton("react", reactCode, "react code")}
									</div>
									<Textarea
										readOnly
										aria-label="React embed code"
										value={reactCode}
										className="h-40 font-mono text-xs"
									/>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				<Card className="h-full">
					<CardHeader>
						<CardTitle>Preview</CardTitle>
						<CardDescription>
							Compare iframe, Web Component, and React outputs side-by-side.
						</CardDescription>
					</CardHeader>
					<CardContent className="h-[560px]">
						<Tabs
							value={previewTab}
							onValueChange={(value) =>
								setPreviewTab(value as "iframe" | "wc" | "react")
							}
							className="h-full"
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="iframe">Iframe</TabsTrigger>
								<TabsTrigger value="wc">Web Component</TabsTrigger>
								<TabsTrigger value="react">React</TabsTrigger>
							</TabsList>
							<TabsContent value="iframe" className="h-full">
								<div className="h-[460px] overflow-hidden rounded-lg border bg-muted/10">
									{previewUrl ? (
										<iframe
											src={previewUrl}
											className="h-full w-full border-0"
											title="Preview"
										/>
									) : null}
								</div>
							</TabsContent>
							<TabsContent value="wc" className="h-full">
								<div className="h-[460px] overflow-auto rounded-lg border bg-muted/10 p-6">
									<memos-embed {...webComponentProps} />
								</div>
							</TabsContent>
							<TabsContent value="react" className="h-full">
								<Suspense
									fallback={
										<div className="flex h-[460px] items-center justify-center rounded-lg border bg-muted/10 p-6 text-sm text-muted-foreground">
											Loading React preview…
										</div>
									}
								>
									<div className="h-[460px] overflow-auto rounded-lg border bg-muted/10 p-6">
										<PlaygroundReactPreview state={state} />
									</div>
								</Suspense>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function ToggleRow({
	id,
	label,
	description,
	checked,
	onCheckedChange,
}: {
	id: string;
	label: string;
	description: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/10 p-4">
			<div className="space-y-1">
				<Label htmlFor={id}>{label}</Label>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
			<Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}

function SelectField<T extends string>({
	id,
	value,
	options,
	onValueChange,
}: {
	id: string;
	value: T;
	options: ReadonlyArray<SelectOption<T>>;
	onValueChange: (value: T) => void;
}) {
	return (
		<div className="relative">
			<select
				id={id}
				value={value}
				onChange={(event) => onValueChange(event.target.value as T)}
				className="border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex h-9 w-full appearance-none rounded-md border bg-transparent px-3 pr-9 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
		</div>
	);
}
