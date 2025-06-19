// middleware/checkCustomer.js

const checkCustomer = (req, res, next) => {
  try {
    // Assuming the user's role_id is stored in the payload of the JWT
    const userRole = req.user.role_id; // req.user is set by the authorization middleware

    if (userRole !== 'customer') {
      return res.status(403).json({ message: "Not authorized. User is not a customer" });
    }

    // If the user is a customer, continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export default checkCustomer;
