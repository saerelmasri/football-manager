import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";


export const authenticateToken = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid." });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN || "");
    const user = await User.findByPk(decoded.id);
    

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).userId = user.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err); // Log the error for debugging

    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
