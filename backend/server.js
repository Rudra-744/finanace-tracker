import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import recordRoutes from "./routes/record.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
