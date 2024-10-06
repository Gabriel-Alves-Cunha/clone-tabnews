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

test("POST to /api/v1/migrations should return 200", async () => {
	{
		const res1 = await fetch("http://localhost:3000/api/v1/migrations", {
			method: "POST",
		});

		expect(res1.status).toBe(201);

		const body = await res1.json();

		console.dir({ body }, { depth: 10 });

		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBeGreaterThan(0);
	}

	{
		const res2 = await fetch("http://localhost:3000/api/v1/migrations", {
			method: "POST",
		});

		expect(res2.status).toBe(200);

		const body = await res2.json();

		console.dir({ body }, { depth: 10 });

		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBe(0);
	}
});
