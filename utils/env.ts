// Casting here because we assure below that all variables are defined:
export const env = {
	// Postgres:
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
	POSTGRES_HOST: process.env.POSTGRES_HOST as string,
	POSTGRES_USER: process.env.POSTGRES_USER as string,
	POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
	POSTGRES_DB: process.env.POSTGRES_DB as string,

	// Database:
	DB_MAX_CONNECTIONS: Number(process.env.DB_MAX_CONNECTIONS),
	DATABASE_URL: process.env.DATABASE_URL as string,
} as const;

// console.log({ env, bunEnv: Bun.env });

for (const [key, value] of Object.entries(env)) {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) {
			throw new Error(
				`Invalid environment variable: "${key}". Should be a valid number, but received \`${value}\``,
			);
		}
	} else if (!value) {
		throw new Error(
			`Missing environment variable: "${key}". Received \`${value}\``,
		);
	}
}
