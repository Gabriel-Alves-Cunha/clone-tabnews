import type { StatusResponse } from "#pages/api/v1/status";

import { expect, test } from "bun:test";

import { DB_MAX_CONNECTIONS } from "#infra/database";

test("GET to /api/v1/status should return 200", async () => {
	const res = await fetch("http://localhost:3000/api/v1/status");

	const body = (await res.json()) as StatusResponse;

	console.log(body);

	expect(body.updated_at).toBeDefined();

	const parsedUpdatedAt = new Date(body.updated_at).toISOString();

	expect(body.updated_at).toBe(parsedUpdatedAt);

	expect(body.dependencies.database.max_connections).toEqual(
		DB_MAX_CONNECTIONS
	);
	expect(body.dependencies.database.version).toEqual("16.1");
});
