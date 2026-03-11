import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type DemoTodo = {
	id: number;
	name: string;
};

const DEFAULT_TODOS: DemoTodo[] = [
	{ id: 1, name: "Get groceries" },
	{ id: 2, name: "Buy a new phone" },
];

const ROUTE_DIR = path.dirname(fileURLToPath(import.meta.url));
const TODOS_FILE = path.resolve(ROUTE_DIR, "../routes/demo/todos.json");

export function getTodosFilePath() {
	return TODOS_FILE;
}

export async function readTodos() {
	return JSON.parse(
		await fs.promises
			.readFile(TODOS_FILE, "utf-8")
			.catch(() => JSON.stringify(DEFAULT_TODOS, null, 2)),
	) as DemoTodo[];
}

export async function writeTodos(todos: DemoTodo[]) {
	await fs.promises.mkdir(path.dirname(TODOS_FILE), { recursive: true });
	await fs.promises.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2));
}
