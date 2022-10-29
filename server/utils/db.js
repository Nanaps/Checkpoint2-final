import * as pg from "pg";
const { Pool } = pg.default;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CC2",
  password: "Helloworld",
  port: 5432,
});
export { pool };
