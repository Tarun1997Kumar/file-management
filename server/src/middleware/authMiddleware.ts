import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../util/jwt";
import Role from "../models/role";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = verifyToken(token) as JwtPayload;
    req.body = { ...req.body, user: decoded };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const authorize = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.body.user.role;
      const role = await Role.findById(userRole).populate("permissions");

      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }

      const hasPermission = role.permissions.some(
        (perm: any) => perm.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Authorization error" });
    }
  };
};
