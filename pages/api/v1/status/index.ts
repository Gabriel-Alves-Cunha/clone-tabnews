import type { NextApiRequest, NextApiResponse } from "next";

import { database } from "#infra/database";

export default async function status(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryResult = await database.query("SELECT 1 + 1 as sum;");

  console.debug(queryResult.rows[0].sum);

  res.status(200).json({ status: "OK" });
}
