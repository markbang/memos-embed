import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		/>
	);
}

export function CheckIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M20 6 9 17l-5-5" />
		</IconBase>
	);
}

export function ChevronDownIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="m6 9 6 6 6-6" />
		</IconBase>
	);
}

export function CodeIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="m16 18 6-6-6-6" />
			<path d="m8 6-6 6 6 6" />
		</IconBase>
	);
}

export function CopyIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<rect x="9" y="9" width="13" height="13" rx="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</IconBase>
	);
}

export function ExternalLinkIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M15 3h6v6" />
			<path d="M10 14 21 3" />
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		</IconBase>
	);
}

export function GithubIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3.07-.35 6.3-1.54 6.3-7A5.44 5.44 0 0 0 19 3.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-6 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 3.77 5.44 5.44 0 0 0 3.7 7.6c0 5.42 3.23 6.61 6.3 7A4.8 4.8 0 0 0 9 18.2v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</IconBase>
	);
}

export function LayoutIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M9 3v18" />
			<path d="M9 9h12" />
		</IconBase>
	);
}

export function MenuIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M4 6h16" />
			<path d="M4 12h16" />
			<path d="M4 18h16" />
		</IconBase>
	);
}

export function MonitorIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<path d="M8 21h8" />
			<path d="M12 17v4" />
		</IconBase>
	);
}

export function MoonIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9Z" />
		</IconBase>
	);
}

export function PackageIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="m7.5 4.27 9 5.15" />
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</IconBase>
	);
}

export function Share2Icon(props: IconProps) {
	return (
		<IconBase {...props}>
			<circle cx="18" cy="5" r="3" />
			<circle cx="6" cy="12" r="3" />
			<circle cx="18" cy="19" r="3" />
			<path d="m8.59 13.51 6.83 3.98" />
			<path d="m15.41 6.51-6.82 3.98" />
		</IconBase>
	);
}

export function SunIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</IconBase>
	);
}

export function XIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</IconBase>
	);
}

export function ZapIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<path d="M13 2 3 14h7l-1 8 10-12h-7z" />
		</IconBase>
	);
}
