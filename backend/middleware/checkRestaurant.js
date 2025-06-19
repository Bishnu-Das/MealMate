// middleware/checkRestaurant.js

export const checkRestaurant = (req, res, next) => {
  try {
    const userRole = req.user.role_id; // Assuming the role is stored in the JWT payload

    if (userRole !== 'restaurant') {
      return res.status(403).json({ message: "Not authorized. User is not a restaurant" });
    }

    next(); // If the user is a restaurant, allow the request to proceed
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
