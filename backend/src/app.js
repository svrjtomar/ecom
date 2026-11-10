import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import ProductRouter from "./routes/product.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
const frontendDist = fileURLToPath(new URL("../../dist", import.meta.url));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static(frontendDist));
app.use("/api/products", ProductRouter);
app.use("/api/auth", AuthRouter);

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    return next();
  }
  return res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
