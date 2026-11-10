import express from "express";
import User from "../model/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { registerValidator } from "../validators/auth.validator.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();
const getRefreshCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken",
  );
  res.json(user);
});

router.get("/users", authenticate, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Email is not registered",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      ...getRefreshCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to log in right now. Please try again.",
    });
  }
});

//register api

router.post("/register", registerValidator, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ status: false, message: "Email/Password is required" });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(existingUser.email);
      return res.status(409).json({
        status: false,
        message: "user is already registered",
        user: existingUser.email,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      ...getRefreshCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "User Registered",
      accessToken,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({
      status: false,
      message: "Unable to create your account right now. Please try again.",
    });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.clearCookie("refreshToken", getRefreshCookieOptions());
    return res.status(401).json({
      message: "Refresh Token Required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (error) {
    res.clearCookie("refreshToken", getRefreshCookieOptions());
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    res.clearCookie("refreshToken", getRefreshCookieOptions());
    return res.status(403).json({
      message: "Invalid Refresh Token",
    });
  }

  const accessToken = generateAccessToken(user._id);

  return res.json({
    accessToken,
  });
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  }

  res.clearCookie("refreshToken", getRefreshCookieOptions());

  res.json({
    message: "Logged Out Successfully",
  });
});

export default router;
