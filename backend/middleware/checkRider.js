// middleware/checkRider.js

const checkRider = (req, res, next) => {
  try {
    // Assuming the user's role_id is stored in the payload of the JWT
    const userRole = req.user.role_id; // req.user is set by the authorization middleware

    if (userRole !== 'rider') {
      return res.status(403).json({ message: "Not authorized. User is not a rider" });
    }

    // If the user is a rider, continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export default checkRider;
