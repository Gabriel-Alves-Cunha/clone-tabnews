import { beforeAll, expect, test } from "bun:test";

import { database } from "#infra/database";

async function cleanDatabase() {
	try {
		await database.query("drop schema public cascade;");
		await database.query("create schema public;");
	} catch (error) {
		console.error("Database clean error!", error);

		throw error;
	}
}

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {
	const res = await fetch("http://localhost:3000/api/v1/migrations");

	expect(res.status).toBe(200);

	const body = await res.json();

	console.dir({ body }, { depth: 10 });

	expect(Array.isArray(body)).toBe(true);
	expect(body.length).toBeGreaterThan(0);
});
