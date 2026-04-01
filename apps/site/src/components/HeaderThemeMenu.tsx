import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import type { SiteThemeMode } from "@/lib/site-theme";
import { m } from "@/paraglide/messages";

const themeOptions: Array<{
	value: SiteThemeMode;
	labelKey: string;
	icon: typeof SunIcon;
}> = [
	{ value: "light", labelKey: "theme_light", icon: SunIcon },
	{ value: "dark", labelKey: "theme_dark", icon: MoonIcon },
	{ value: "system", labelKey: "theme_system", icon: MonitorIcon },
];

const getThemeLabel = (key: string) => {
	const labels: Record<string, () => string> = {
		theme_light: () => m.theme_light(),
		theme_dark: () => m.theme_dark(),
		theme_system: () => m.theme_system(),
	};
	return labels[key]?.() ?? key;
};

export function HeaderThemeMenu({
	themeMode,
	onThemeChange,
}: {
	themeMode: SiteThemeMode;
	onThemeChange: (nextTheme: SiteThemeMode) => void;
}) {
	return (
		<div className="absolute right-0 top-full z-50 mt-2 min-w-40 overflow-hidden rounded-md border bg-popover p-1 shadow-md">
			{themeOptions.map((option) => {
				const Icon = option.icon;
				const isActive = themeMode === option.value;
				return (
					<button
						type="button"
						key={option.value}
						onClick={() => onThemeChange(option.value)}
						className="focus:bg-accent focus:text-accent-foreground flex w-full items-center justify-between gap-6 rounded-sm px-2 py-1.5 text-sm outline-hidden"
					>
						<span className="inline-flex items-center gap-2">
							<Icon className="size-4" />
							{getThemeLabel(option.labelKey)}
						</span>
						{isActive ? <CheckIcon className="size-4" /> : null}
					</button>
				);
			})}
		</div>
	);
}
