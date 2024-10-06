import { expect, test } from "bun:test";
import type { StatusResponse } from "#pages/api/v1/status";

import { env } from "utils/env";

test("GET to /api/v1/status should return 200", async () => {
	const res = await fetch("http://localhost:3000/api/v1/status");

	const body = (await res.json()) as StatusResponse;

	console.dir({ body, res }, { depth: 10 });

	expect(body.updated_at).toBeDefined();

	const parsedUpdatedAt = new Date(body.updated_at).toISOString();

	expect(body.updated_at).toBe(parsedUpdatedAt);

	expect(body.dependencies.database.max_connections).toEqual(
		env.DB_MAX_CONNECTIONS,
	);
	expect(body.dependencies.database.version).toEqual("16.1");
	expect(body.dependencies.database.opened_connections).toBeGreaterThanOrEqual(
		1,
	);
});
