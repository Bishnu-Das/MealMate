import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authorization = async (req, res, next) => {
  try {
    const jwtToken = req.cookies?.jwt;
    console.log("jwtToken", jwtToken);

    if (!jwtToken) {
      return res.status(403).json("not athorize");
    }
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json("not athorize");
  }
};
export default authorization;
