import { spawnSync } from "node:child_process";

const run = (command, args) =>
	spawnSync(command, args, {
		stdio: "inherit",
		shell: process.platform === "win32",
	});

if (process.env.CI) {
	process.exit(0);
}

const gitCheck = run("git", ["rev-parse", "--is-inside-work-tree"]);
if (gitCheck.status !== 0) {
	process.exit(0);
}

const installResult = run("pnpm", ["exec", "prek", "install", "--prepare-hooks"]);
if (installResult.status !== 0) {
	console.warn(
		"[prek] Could not auto-install Git hooks. Run `pnpm prek:install` manually if needed.",
	);
}
