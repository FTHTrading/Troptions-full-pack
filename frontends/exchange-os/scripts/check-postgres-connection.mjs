import pkg from "pg";

const { Pool } = pkg;

async function run() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set. Postgres check skipped.");
    process.exitCode = 0;
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query("SELECT NOW() as now");
    console.log(`Postgres connection ok: ${result.rows[0].now.toISOString?.() ?? result.rows[0].now}`);
  } finally {
    await pool.end();
  }
}

run().catch((error) => {
  console.error(`Postgres connection failed: ${error.message}`);
  process.exitCode = 1;
});
