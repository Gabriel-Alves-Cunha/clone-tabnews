import { join } from "node:path";
import type { NextApiRequest, NextApiResponse } from "next";
import migrationRunner, { type RunnerOption } from "node-pg-migrate";

import { database } from "#infra/database";
import { env } from "#utils/env";

export default async function migrations(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const dbClient = await database.getNewClient();

	const runnerOption: RunnerOption = {
		dir: join("infra", "migrations"),
		migrationsTable: "pgmigrations",
		databaseUrl: env.DATABASE_URL,
		direction: "up",
		verbose: true,
		dryRun: true,
		dbClient,
	};

	switch (req.method) {
		case "GET": {
			const pendingMigrations = await migrationRunner(runnerOption);

			await dbClient.end();

			return res.status(200).json(pendingMigrations);
		}

		case "POST": {
			const migratedMigrations = await migrationRunner({
				...runnerOption,
				dryRun: false,
			});

			await dbClient.end();

			return res
				.status(migratedMigrations.length === 0 ? 200 : 201)
				.json(migratedMigrations);
		}

		default: {
			return res.status(405).end();
		}
	}
}
