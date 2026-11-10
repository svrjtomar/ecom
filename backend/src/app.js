import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import ProductRouter from "./routes/product.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/products", ProductRouter);
app.use("/api/auth", AuthRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
