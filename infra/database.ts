import { Client, type ClientBase } from "pg";

import { env } from "#utils/env";

// biome-ignore lint/suspicious/noExplicitAny: The types from the pg package show that this is an overloaded function.
type OverloadedArgument = any;

type Database = {
	getNewClient: () => Promise<Client>;
	query: ClientBase["query"];
};

export const database: Database = {
	async query(queryText: OverloadedArgument) {
		let client: Client | undefined;

		try {
			client = await database.getNewClient();

			const result = await client.query(queryText);

			console.log("db query result:");
			console.dir(result, { depth: 10 });

			return result;
		} catch (error) {
			console.error("Database query error!", error);

			throw error;
		} finally {
			await client?.end();
		}
	},

	async getNewClient() {
		const client = new Client({
			port: Number(env.POSTGRES_PORT),
			password: env.POSTGRES_PASSWORD,
			database: env.POSTGRES_DB,
			host: env.POSTGRES_HOST,
			user: env.POSTGRES_USER,
			ssl: getSslValues(),
		});

		await client.connect();

		return client;
	},
};

const getSslValues = () => {
	if (process.env.POSTGRES_CA) {
		return {
			ca: process.env.POSTGRES_CA,
		};
	}

	return process.env.NODE_ENV === "production";
};
