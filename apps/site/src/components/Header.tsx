import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ParaglideLocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
	const toggleTheme = (newTheme: "light" | "dark") => {
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const navLinks = [
		{ to: "/", label: "Home" },
		{ to: "/docs", label: "Docs" },
		{ to: "/playground", label: "Playground" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center mx-auto px-4">
				<div className="mr-4 hidden md:flex">
					<Link to="/" className="mr-6 flex items-center space-x-2">
						<span className="hidden font-bold sm:inline-block">
							Memos Embed
						</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{navLinks.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className="transition-colors hover:text-foreground/80 text-foreground/60"
								activeProps={{ className: "text-foreground" }}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="pr-0">
						<SheetHeader>
							<SheetTitle>Memos Embed</SheetTitle>
							<SheetDescription>Navigation</SheetDescription>
						</SheetHeader>
						<nav className="flex flex-col gap-4 mt-4">
							{navLinks.map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="block px-2 py-1 text-lg"
								>
									{link.label}
								</Link>
							))}
						</nav>
						<Separator className="my-4" />
						<div className="px-2">
							<ParaglideLocaleSwitcher />
						</div>
					</SheetContent>
				</Sheet>

				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none"></div>
					<nav className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
									<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
									<span className="sr-only">Toggle theme</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => toggleTheme("light")}>
									Light
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => toggleTheme("dark")}>
									Dark
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<ParaglideLocaleSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}
