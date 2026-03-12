import fs from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { getTodosFilePath, readTodos, writeTodos } from "@/lib/todo-storage";

describe("todo storage", () => {
	const todosFile = getTodosFilePath();
	const cleanup = async () => {
		await fs.promises.rm(todosFile, { force: true });
	};

	afterEach(async () => {
		await cleanup();
	});

	it("returns default todos when the storage file is missing", async () => {
		await cleanup();

		await expect(readTodos()).resolves.toEqual([
			{ id: 1, name: "Get groceries" },
			{ id: 2, name: "Buy a new phone" },
		]);
	});

	it("persists todos to disk and reads them back", async () => {
		const todos = [
			{ id: 1, name: "Ship test coverage" },
			{ id: 2, name: "Review demo route" },
		];

		await writeTodos(todos);

		await expect(readTodos()).resolves.toEqual(todos);
	});
});
