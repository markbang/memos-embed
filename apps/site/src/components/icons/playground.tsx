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

export function CopyIcon(props: IconProps) {
	return (
		<IconBase {...props}>
			<rect x="9" y="9" width="13" height="13" rx="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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
