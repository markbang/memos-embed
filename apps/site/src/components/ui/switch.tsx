"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange"> & {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
};

function Switch({
	className,
	checked = false,
	onCheckedChange,
	type,
	onClick,
	...props
}: SwitchProps) {
	return (
		<button
			type={type ?? "button"}
			role="switch"
			aria-checked={checked}
			data-slot="switch"
			data-state={checked ? "checked" : "unchecked"}
			className={cn(
				"inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
				checked ? "bg-primary" : "bg-input dark:bg-input/80",
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					onCheckedChange?.(!checked);
				}
			}}
			{...props}
		>
			<span
				data-slot="switch-thumb"
				data-state={checked ? "checked" : "unchecked"}
				className={cn(
					"pointer-events-none block size-4 rounded-full ring-0 transition-transform",
					checked
						? "translate-x-[calc(100%-2px)] bg-primary-foreground"
						: "translate-x-0 bg-background dark:bg-foreground",
				)}
			/>
		</button>
	);
}

export { Switch };
