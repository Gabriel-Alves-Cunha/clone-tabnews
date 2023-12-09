import type { NextApiRequest, NextApiResponse } from "next";

import type { DateString } from "utils/utilityTypes";

import { database } from "#infra/database";

export type StatusResponse = {
	updated_at: DateString;
	dependencies: {
		database: {
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

	const databaseVersionResult = await database.query<{
		server_version: string;
	}>("SHOW server_version;);");

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

	res.status(200).json({
		dependencies: {
			database: {
				max_connections: Number(databaseMaxConnectionsValue),
				version: databaseVersionValue,
			},
		},
		updated_at: updatedAt,
	} satisfies StatusResponse);
}
