import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * Shape of the decoded JWT payload produced by the login route.
 */
interface JwtPayload {
  email: string;
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Express middleware that verifies the JWT in the Authorization header
 * and attaches `userData` (email + userId) to the request object.
 *
 * Expected header format: `Authorization: Bearer <token>`
 */
const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "You Are Not authenticated!" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;

    req.userData = { email: decoded.email, userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You Are Not authenticated!" });
  }
};

export default checkAuth;

// CJS compatibility — allows require("../middleware/check-auth") to return the function directly
module.exports = checkAuth;
module.exports.default = checkAuth;
