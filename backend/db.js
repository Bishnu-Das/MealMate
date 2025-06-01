import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "riyo",
  host: "localhost",
  port: 5432,
  database: "food_panda",
});

export default pool;
