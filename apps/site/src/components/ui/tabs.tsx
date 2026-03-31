"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useId,
	useMemo,
	useState,
} from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
	value: string;
	setValue: (value: string) => void;
	baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs components must be used within <Tabs>.");
	}
	return context;
};

type TabsProps = {
	children: ReactNode;
	className?: string;
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
};

function Tabs({
	children,
	className,
	defaultValue,
	value,
	onValueChange,
}: TabsProps) {
	const generatedId = useId();
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue ?? "",
	);
	const currentValue = value ?? uncontrolledValue;

	const contextValue = useMemo<TabsContextValue>(
		() => ({
			value: currentValue,
			setValue: (nextValue) => {
				if (value === undefined) {
					setUncontrolledValue(nextValue);
				}
				onValueChange?.(nextValue);
			},
			baseId: generatedId,
		}),
		[currentValue, generatedId, onValueChange, value],
	);

	return (
		<TabsContext.Provider value={contextValue}>
			<div data-slot="tabs" className={cn("flex flex-col gap-2", className)}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="tabs-list"
			role="tablist"
			className={cn(
				"bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
				className,
			)}
			{...props}
		/>
	);
}

type TabsTriggerProps = React.ComponentProps<"button"> & {
	value: string;
};

function TabsTrigger({
	className,
	value,
	onClick,
	...props
}: TabsTriggerProps) {
	const context = useTabsContext();
	const isActive = context.value === value;
	const triggerId = `${context.baseId}-${value}-trigger`;
	const contentId = `${context.baseId}-${value}-content`;

	return (
		<button
			type="button"
			data-slot="tabs-trigger"
			data-state={isActive ? "active" : "inactive"}
			role="tab"
			id={triggerId}
			aria-controls={contentId}
			aria-selected={isActive}
			className={cn(
				"text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				isActive &&
					"bg-background text-foreground shadow-sm dark:border-input dark:bg-input/30",
				className,
			)}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) {
					context.setValue(value);
				}
			}}
			{...props}
		/>
	);
}

type TabsContentProps = React.ComponentProps<"div"> & {
	value: string;
};

function TabsContent({ className, value, ...props }: TabsContentProps) {
	const context = useTabsContext();
	const isActive = context.value === value;

	if (!isActive) {
		return null;
	}

	return (
		<div
			data-slot="tabs-content"
			data-state="active"
			role="tabpanel"
			id={`${context.baseId}-${value}-content`}
			aria-labelledby={`${context.baseId}-${value}-trigger`}
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
