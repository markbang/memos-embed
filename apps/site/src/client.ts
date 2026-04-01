import { shouldHydrateSitePath } from "@/lib/route-mode";

if (shouldHydrateSitePath(window.location.pathname)) {
	void import("./client-interactive");
}
