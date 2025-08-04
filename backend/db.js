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

// const connectionString = process.env.DATABASE_URL;
// const pool = postgres(connectionString);
// const result = await pool`SELECT NOW()`;
// console.log(result);

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const pool = new Pool({
  user: "postgres",
  password: "riyo",
  host: "localhost",
  port: 5432,
  database: "food_panda",
});

export default pool;

// import postgres from 'postgres'

// const connectionString = process.env.DATABASE_URL
// const sql = postgres(connectionString)

// export default sql
