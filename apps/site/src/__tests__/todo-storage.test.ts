import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getTodosFilePath, readTodos, writeTodos } from "@/lib/todo-storage";

describe("todo storage", () => {
	const todosFile = getTodosFilePath();
	const todosDir = path.dirname(todosFile);
	const cleanup = async () => {
		await fs.promises.rm(todosFile, { force: true });
	};

	afterEach(async () => {
		await cleanup();
	});

	it("exposes the demo todos file path", () => {
		expect(todosFile).toContain(path.join("routes", "demo", "todos.json"));
	});

	it("returns default todos when the storage file is missing", async () => {
		await cleanup();

		await expect(readTodos()).resolves.toEqual([
			{ id: 1, name: "Get groceries" },
			{ id: 2, name: "Buy a new phone" },
		]);
	});

	it("creates the storage directory when persisting todos", async () => {
		const todos = [{ id: 1, name: "Recreate storage directory" }];

		await fs.promises.rm(todosDir, { recursive: true, force: true });
		await writeTodos(todos);

		await expect(fs.promises.stat(todosDir)).resolves.toMatchObject({
			isDirectory: expect.any(Function),
		});
		await expect(readTodos()).resolves.toEqual(todos);
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
