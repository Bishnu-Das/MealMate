import pool from "../../db.js";

export const getReviewsAll = async (req, res) => {
  const restaurantId = req.user.id;

  try {
    const reviews = await pool.query(
      `
      SELECT 
        r.review_id,
        r.rating, 
        r.comment, 
        r.created_at, 
        u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN orders o ON o.order_id = r.order_id
      WHERE r.restaurant_id = $1
      ORDER BY r.created_at DESC
      `,
      [restaurantId]
    );

    res.status(200).json(reviews.rows);
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getIndividualMenuReview = async (req, res) => {
  const restaurant_id = req.user.id;
  const { id: menu_item_id } = req.params;
  try {
    const reviews = await pool.query(
      `
      SELECT 
        r.review_id,
        r.rating, 
        r.comment, 
        r.created_at, 
        u.name AS user_name,
        mi.name AS menu_item_name,
        mi.menu_item_image_url,
        mi.description
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      JOIN orders o ON o.order_id = r.order_id
      JOIN order_items oi ON oi.order_id = o.order_id
      JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id
      WHERE r.restaurant_id = $1 AND mi.menu_item_id = $2
      ORDER BY r.created_at DESC
      `,
      [restaurant_id, menu_item_id]
    );

    res.status(200).json(reviews.rows);
  } catch (error) {
    console.error("Error fetching menu item reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
