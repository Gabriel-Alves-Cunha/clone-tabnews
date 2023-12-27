import type { NextApiRequest, NextApiResponse } from "next";

import type { DateString } from "utils/utilityTypes";

import { database } from "#infra/database";
import { env } from "utils/env";

export type StatusResponse = {
	updated_at: DateString;
	dependencies: {
		database: {
			opened_connections: number;
			max_connections: number;
			version: string;
		};
	};
};

export default async function status(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const updatedAt = new Date().toISOString();

	// DB Version:
	const databaseVersionResult = await database.query<{
		server_version: string;
	}>("SHOW server_version;");

	if (!databaseVersionResult) {
		return res.status(500).json({
			error: "Database error! Could not get database version.",
		});
	}

	const databaseVersionValue = databaseVersionResult.rows[0]?.server_version;

	if (!databaseVersionValue) {
		return res.status(500).json({
			error:
				"Database error! Could not get database version out of query response.",
		});
	}

	// DB Max Connections:
	const databaseMaxConnectionsResult = await database.query<{
		max_connections: string;
	}>("SHOW max_connections;");

	if (!databaseMaxConnectionsResult) {
		return res.status(500).json({
			error:
				"Database error! Could not get database number of max connections.",
		});
	}

	const databaseMaxConnectionsValue =
		databaseMaxConnectionsResult.rows[0]?.max_connections;

	if (!databaseMaxConnectionsValue) {
		return res.status(500).json({
			error:
				"Database error! Could not get database number of max connections out of query response.",
		});
	}

	// DB Opened Connections:
	const dbName = env.POSTGRES_DB;

	const databaseOpenedConnectionsResult = await database.query<{
		count: number;
	}>({
		text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
		values: [dbName],
	});

	const databaseOpenedConnectionsValue =
		databaseOpenedConnectionsResult.rows[0]?.count;

	if (!Number.isFinite(databaseOpenedConnectionsValue)) {
		return res.status(500).json({
			error: `Database error! Could not get database number of opened connections out of query response. Received: ${databaseOpenedConnectionsValue}`,
		});
	}

	// Result:
	res.status(200).json({
		dependencies: {
			database: {
				// Casting here because we check above if it's finite:
				opened_connections: databaseOpenedConnectionsValue as number,
				max_connections: Number(databaseMaxConnectionsValue),
				version: databaseVersionValue,
			},
		},
		updated_at: updatedAt,
	} satisfies StatusResponse);
}
