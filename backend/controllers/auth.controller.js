import { generateToken } from "../utils/jwtGenerator.js";
import bcrypt from "bcrypt";
import pool from "../db.js";

export const signup = async (req, res) => {
  try {
    //1. destructure the req.body (name, email, password)
    const { name, email, password, phone_number, latitude, longitude } =
      req.body;
    const role_id = "customer";
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
    if (latitude !== null && longitude !== null) {
      await pool.query(
        "INSERT INTO user_locations (user_id, latitude, longitude) VALUES ($1, $2, $3)",
        [newUser.rows[0].user_id, latitude, longitude]
      );
    }
    //res.json(newUser.rows[0]);
    //5. generating our jwt token
    generateToken(newUser.rows[0].user_id, "customer", res);
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
    generateToken(user_id, "customer", res);

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
    const radius = 5000;

    let result = await pool.query(
      `
      SELECT r.restaurant_id,r.name,r.phone,r.email,r.average_rating, 
        ST_Distance(
          ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
          ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY
        ) AS distance
      FROM restaurants r
      JOIN user_locations rl ON rl.restaurant_id = r.restaurant_id
      JOIN user_locations ul ON ul.user_id = $1 AND ul.is_primary = true
      WHERE ST_DWithin(
        ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
        ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY,
        $2
      )
      ORDER BY distance
      LIMIT 30
      `,
      [id, radius]
    );

    // If no restaurants found in 5km, try 10km
    if (result.rows.length === 0) {
      const radius2 = 10000;
      result = await pool.query(
        `
        SELECT r.restaurant_id,r.name,r.phone,r.email,r.average_rating, 
          ST_Distance(
            ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
            ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY
          ) AS distance
        FROM restaurants r
        JOIN user_locations rl ON rl.restaurant_id = r.restaurant_id
        JOIN user_locations ul ON ul.user_id = $1 AND ul.is_primary = true
        WHERE ST_DWithin(
          ST_MakePoint(rl.longitude, rl.latitude)::GEOGRAPHY,
          ST_MakePoint(ul.longitude, ul.latitude)::GEOGRAPHY,
          $2
        )
        ORDER BY distance
        LIMIT 30
        `,
        [id, radius2]
      );
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in getNearbyRestaurants:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const changePassword = async (req, res) => {
  const id = req.user.id;
  const { prevPassword, newPassword } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const validpassword = await bcrypt.compare(
      prevPassword,
      user.rows[0].password
    );
    if (!validpassword) {
      return res.status(401).json({ password: "invalid previous password" });
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      hashedPassword,
      id,
    ]);
    res.status(200).json({ message: "Password changed successfully.." });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "server error. in change password.." });
  }
};

export const varifyUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_id =  $1", [
      id,
    ]);
    res.status(200).json({
      message: "varified user",
      user_id: user.rows[0].user_id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      phone_number: user.rows[0].phone_number,
      role_id: user.rows[0].role_id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  const id = req.user.id;
  const { name, phone_number, latitude, longitude } = req.body;

  try {
    // Try updating location
    const locationUpdate = await pool.query(
      "UPDATE user_locations SET latitude = $1, longitude = $2 WHERE user_id = $3 RETURNING *",
      [latitude, longitude, id]
    );

    // If no existing location, insert it
    if (locationUpdate.rowCount === 0) {
      await pool.query(
        "INSERT INTO user_locations (user_id, latitude, longitude, is_primary) VALUES ($1, $2, $3, $4)",
        [id, latitude, longitude, true]
      );
    }

    // Update name and phone
    const user = await pool.query(
      "UPDATE users SET name = $1, phone_number = $2 WHERE user_id = $3 returning *",
      [name, phone_number, id]
    );
    res.status(200).json({
      message: "updated profile successful",
      user_id: user.rows[0].user_id,
      name: user.rows[0].name,
      email: user.rows[0].email,
      phone_number: user.rows[0].phone_number,
      role_id: user.rows[0].role_id,
    });
  } catch (err) {
    console.error("Error in updateProfile:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id =  $1", [
      id,
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_categories LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenus = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_items LIMIT 30");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMenuItem = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items where menu_item_id = $1",
      [id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in get restaurant:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
