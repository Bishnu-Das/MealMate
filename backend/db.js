import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

// const pool = new Pool({
//   user: "postgres.nesuzbfybutrdmtrtgai",
//   password: "2B||!2Bthatisthe?", // No URL encoding needed
//   host: "aws-0-ap-southeast-1.pooler.supabase.com",
//   port: 5432,
//   database: "postgres",
//   ssl: { rejectUnauthorized: false }, // Required for Supabase
// });

const pool = new Pool({
  user: "postgres",
  password: "riyo",
  host: "localhost",
  port: 5432,
  database: "food_panda",
});

export default pool;
