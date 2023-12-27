import { Client, type ClientBase } from "pg";

import { env } from "utils/env";

// biome-ignore lint/suspicious/noExplicitAny: The types from the pg package show that this is an overloaded function.
type OverloadedArgument = any;

type Database = {
	query: ClientBase["query"];
};

export const database: Database = {
	async query(queryText: OverloadedArgument) {
		const client = new Client({
			port: Number(env.POSTGRES_PORT),
			password: env.POSTGRES_PASSWORD,
			database: env.POSTGRES_DB,
			host: env.POSTGRES_HOST,
			user: env.POSTGRES_USER,
		});

		try {
			await client.connect();

			const result = await client.query(queryText);

			console.info("db query result:");
			console.dir(result, { depth: 10 });

			return result;
		} catch (error) {
			console.error("Database query error!", error);
		} finally {
			await client.end();
		}
	},
};
