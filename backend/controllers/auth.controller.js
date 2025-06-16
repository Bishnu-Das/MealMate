import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";
import pool from "../db.js";

export const signup = async (req, res) => {
  try {
    //1. destructure the req.body (name, email, password)
    const { name, email, password, phone_number, role_id } = req.body;
    //2. check if user exist through error
    const user = await pool.query("select * from users where email = $1", [
      email,
    ]);

    // res.json(user.rows);
    if (user.rows.length !== 0) {
      return res.status(409).json({ message: "user already exist" });
    }

    //3. bcypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    //4. enter the new user iside our database
    const newUser = await pool.query(
      "INSERT INTO USERS (name,email,password,phone_number,role_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, email, hashedPassword, phone_number, role_id]
    );
    //res.json(newUser.rows[0]);
    //5. generating our jwt token
    generateToken(newUser.rows[0].user_id, res);
    res.status(201).json({
      user_id: newUser.rows[0].user_id,
      email: newUser.rows[0].email,
      phone_number: newUser.rows[0].phone_number,
      role_id: newUser.rows[0].role_id,
      message: "created successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //2. check if user dosen't exist

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 and role_id = 'customer'",
      [email]
    );

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ message: "user not found. check your email." });
    }

    //3. if it does check pass
    const validpassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validpassword) {
      return res.status(401).json({ password: "invalid credentials" });
    }

    //4. give them the jwt token
    const user_id = user.rows[0].user_id;
    generateToken(user_id, res);

    res.status(200).json({
      message: "Login successful",
      user_id: user.rows[0].user_id,
      email: user.rows[0].email,
      phone_number: user.rows[0].phone_number,
      role_id: user.rows[0].role_id,
    });
  } catch (err) {
    console.log("Error in login controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const getNearbyRestaurants = async (req, res) => {
  try {
    const id = req.user.id;
    const nearbyRestaurants = await pool.query(
      `
      SELECT r.*, 
        ST_Distance(
          ST_MakePoint(r.longitude, r.latitude)::GEOGRAPHY,
          ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY
        ) AS distance
      FROM restaurants r
      JOIN user_locations ul ON ul.user_id = $1
      WHERE ul.is_primary = true AND ST_DWithin(
        ST_MakePoint(r.longitude, r.latitude)::GEOGRAPHY,
        ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY,
        $2
      )
      ORDER BY distance
      LIMIT 30
      `,
      [id, 5000] // 5000 meters = 5 km
    );
    if (nearbyRestaurants.rows.length === 0) {
      const nearbyRestaurants = await pool.query(
        `
      SELECT r.*, 
        ST_Distance(
          ST_MakePoint(r.longitude, r.latitude)::GEOGRAPHY,
          ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY
        ) AS distance
      FROM restaurants r
      JOIN user_locations ul ON ul.user_id = $1
      WHERE ul.is_primary = true AND ST_DWithin(
        ST_MakePoint(r.longitude, r.latitude)::GEOGRAPHY,
        ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY,
        $2
      )
      ORDER BY distance
      LIMIT 30
      `,
        [id, 10000] // 5000 meters = 5 km
      );
    }

    res.status(200).json(nearbyRestaurants.rows);
  } catch (err) {
    console.error("Error in getNearbyRestaurants:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
