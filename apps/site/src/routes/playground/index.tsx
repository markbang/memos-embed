import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MemoEmbed } from "@memos-embed/react";
import { themePresets, type ThemePresetName } from "memos-embed";

export const Route = createFileRoute("/playground/")({
	component: PlaygroundComponent,
});

const themeOptions = (Object.keys(themePresets) as ThemePresetName[]).map(
	(value) => ({
		value,
		label: themePresets[value].name,
	}),
);

const densityOptions = [
	{ value: "comfortable", label: "Comfortable" },
	{ value: "compact", label: "Compact" },
];

function PlaygroundComponent() {
	const [baseUrl, setBaseUrl] = useState("https://demo.usememos.com/api/v1");
	const [memoId, setMemoId] = useState("1");
	const [theme, setTheme] = useState<ThemePresetName>("minimal");
	const [density, setDensity] = useState<"comfortable" | "compact">(
		"comfortable",
	);
	const [embedBaseUrl, setEmbedBaseUrl] = useState("");

	const baseUrlId = useId();
	const memoIdId = useId();
	const themeId = useId();
	const densityId = useId();

	useEffect(() => {
		if (typeof window !== "undefined") {
			setEmbedBaseUrl(window.location.origin);
			import("@memos-embed/wc").then((mod) => mod.defineMemosEmbedElement());
		}
	}, []);

	const previewUrl = `${embedBaseUrl || ""}/embed/${memoId}?baseUrl=${encodeURIComponent(baseUrl)}&theme=${theme}&density=${density}`;
	const embedUrl = `${embedBaseUrl || "https://your-embed-site.com"}/embed/${memoId}?baseUrl=${encodeURIComponent(baseUrl)}&theme=${theme}&density=${density}`;

	const iframeCode = `<iframe
  src="${embedUrl}"
  style="width: 100%; height: 240px; border: none; overflow: hidden;"
  title="memos-embed"
></iframe>`;

	const webComponentCode = `<script type="module" src="https://unpkg.com/@memos-embed/wc@latest/dist/register.js"></script>
<memos-embed
  base-url="${baseUrl}"
  memo-id="${memoId}"
  theme="${theme}"
  density="${density}"
></memos-embed>`;

	const reactCode = `import { MemoEmbed } from '@memos-embed/react'

<MemoEmbed
  baseUrl="${baseUrl}"
  memoId="${memoId}"
  theme="${theme}"
  density="${density}"
/>`;

	return (
		<div className="container mx-auto py-10 px-4">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Configuration</CardTitle>
							<CardDescription>Customize your embed settings.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor={baseUrlId}>Base URL</Label>
								<Input
									id={baseUrlId}
									value={baseUrl}
									onChange={(event) => setBaseUrl(event.target.value)}
									placeholder="https://demo.usememos.com/api/v1"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={memoIdId}>Memo ID</Label>
								<Input
									id={memoIdId}
									value={memoId}
									onChange={(event) => setMemoId(event.target.value)}
									placeholder="1"
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={themeId}>Theme</Label>
									<Select
										value={theme}
										onValueChange={(value) =>
											setTheme(value as ThemePresetName)
										}
									>
										<SelectTrigger id={themeId}>
											<SelectValue placeholder="Select a theme" />
										</SelectTrigger>
										<SelectContent>
											{themeOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor={densityId}>Density</Label>
									<Select
										value={density}
										onValueChange={(value) =>
											setDensity(value as "comfortable" | "compact")
										}
									>
										<SelectTrigger id={densityId}>
											<SelectValue placeholder="Select density" />
										</SelectTrigger>
										<SelectContent>
											{densityOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
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
								<TabsContent value="iframe">
									<Textarea
										readOnly
										value={iframeCode}
										className="h-32 font-mono text-xs"
									/>
								</TabsContent>
								<TabsContent value="wc">
									<Textarea
										readOnly
										value={webComponentCode}
										className="h-32 font-mono text-xs"
									/>
								</TabsContent>
								<TabsContent value="react">
									<Textarea
										readOnly
										value={reactCode}
										className="h-32 font-mono text-xs"
									/>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				<Card className="h-full">
					<CardHeader>
						<CardTitle>Preview</CardTitle>
						<CardDescription>See your embed in action.</CardDescription>
					</CardHeader>
					<CardContent className="h-[520px]">
						<Tabs defaultValue="iframe" className="h-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="iframe">Iframe</TabsTrigger>
								<TabsTrigger value="wc">Web Component</TabsTrigger>
								<TabsTrigger value="react">React</TabsTrigger>
							</TabsList>
							<TabsContent value="iframe" className="h-full">
								<div className="h-[420px] overflow-hidden rounded-lg border bg-muted/10">
									<iframe
										src={previewUrl}
										className="h-full w-full border-0"
										title="Preview"
									/>
								</div>
							</TabsContent>
							<TabsContent value="wc" className="h-full">
								<div className="h-[420px] overflow-auto rounded-lg border bg-muted/10 p-6">
									<memos-embed
										base-url={baseUrl}
										memo-id={memoId}
										theme={theme}
										density={density}
									/>
								</div>
							</TabsContent>
							<TabsContent value="react" className="h-full">
								<div className="h-[420px] overflow-auto rounded-lg border bg-muted/10 p-6">
									<MemoEmbed
										baseUrl={baseUrl}
										memoId={memoId}
										theme={theme}
										density={density}
									/>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
