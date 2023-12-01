import { Client, type Submittable } from "pg";

async function query(queryObject: Submittable) {
  const client = new Client({
    port: Number(process.env.POSTGRES_PORT),
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
  });

  await client.connect();

  const result = await client.query(queryObject);

  await client.end();

  return result;
}

export const database = {
  query,
};
