export const env = {
	// Postgres:
	POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_HOST: process.env.POSTGRES_HOST,
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_DB: process.env.POSTGRES_DB,

	// Database:
	DB_MAX_CONNECTIONS: Number(process.env.DB_MAX_CONNECTIONS),
} as const;

for (const [key, value] of Object.entries(env)) {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) {
			throw new Error(
				`Invalid environment variable: ${key}. Should be a valid number, but received \`${value}\``
			);
		}
	} else if (!value) {
		throw new Error(
			`Missing environment variable: ${key}. Received \`${value}\``
		);
	}
}
