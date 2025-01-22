import { User } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, RequestHandler, Response } from "express";

dotenv.config();

// @ts-ignore
export const register: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = await User.create({ email, password: hashedPassword });
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_TOKEN || "",
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      errorMsg: error,
    });
  }
};
// @ts-ignore
export const login: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("Password:", password);
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatched = await bcrypt.compare(password.trim(), user.password);
    console.log("Hashed:", passwordMatched);

    if (!passwordMatched) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_TOKEN || "",
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Login successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      errorMsg: error,
    });
  }
};
