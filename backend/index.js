import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import customerRoute from "./routes/customerRoute.js";
import riderRoute from "./routes/riderRoute.js";
import restaurantRoute from "./routes/restaurantRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//register and login

app.use("/api/customer", customerRoute);
app.use("/api/rider", riderRoute);
app.use("/api/restaurant", restaurantRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
