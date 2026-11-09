import "dotenv/config";
import pg from "pg";

const { Client } = pg;
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://fabriscope:fabriscope_local@localhost:5432/fabriscope?schema=public";

const client = new Client({ connectionString });

try {
  await client.connect();
  const result = await client.query<{ database: string }>(
    "SELECT current_database() AS database",
  );
  const database = result.rows[0]?.database;

  if (!database) {
    throw new Error("PostgreSQL이 현재 database 이름을 반환하지 않았습니다.");
  }

  console.log(`PostgreSQL 연결 정상: ${database}`);
} finally {
  await client.end();
}
