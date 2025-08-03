import pool from "./db.js";

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected! Time:", res.rows[0]);
  } catch (err) {
    console.error("Error connecting to Supabase DB:", err);
  } finally {
    pool.end();
  }
})();
