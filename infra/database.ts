import { Client, type ClientBase } from "pg";

export const DB_MAX_CONNECTIONS = 100;

// biome-ignore lint/suspicious/noExplicitAny: The types from the pg package show that this is an overloaded function.
type OverloadedArgument = any;

type Database = {
	query: ClientBase["query"];
};

export const database: Database = {
	async query(queryText: OverloadedArgument) {
		const client = new Client({
			port: Number(process.env.POSTGRES_PORT),
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			host: process.env.POSTGRES_HOST,
			user: process.env.POSTGRES_USER,
		});

		try {
			await client.connect();

			const result = await client.query(queryText);

			return result;
		} catch (error) {
			console.error("Database query error!", error);
		} finally {
			await client.end();
		}
	},
};
