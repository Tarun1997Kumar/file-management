import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../util/jwt";
import Role from "../models/role";
import User from "../models/user";

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

    if (!decoded) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      res
        .status(401)
        .json({ message: "Your account does not exist or has been removed." });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        message: "Your account has been deactivated, please contact support.",
      });
      return;
    }

    req.body = { ...req.body, user: decoded };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const authorize = (permission?: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.body.user.role;

      if (userRole === "master-admin") {
        return next(); // master-admin can do everything
      }

      const role = await Role.findOne({ name: userRole })
        .populate("permissions")
        .lean();

      if (!role) {
        res
          .status(403)
          .json({ message: "Role not found, please contact support." });
        return;
      }

      const hasPermission = Array.isArray(permission)
        ? role.permissions?.some((perm: any) => permission.includes(perm.name))
        : role.permissions?.some((perm: any) => {
            return perm.name === permission;
          });

      if (!hasPermission) {
        res.status(403).json({
          message: "Insufficient permissions, please check your access rights.",
        });
        return;
      }

      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
};
