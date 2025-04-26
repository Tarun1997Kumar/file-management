import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import File from "../../models/file";
import User from "../../models/user";

const userRouters = Router();
userRouters.use(authenticate, authorize("master:permission"));

userRouters.get("/users", async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
});

userRouters.put("/users/:id/role", async (req, res) => {
  const { roleId } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role: roleId },
    { new: true }
  );
  res.json(updatedUser);
});

userRouters.put("/users/:id/status", async (req, res) => {
  const isActive = req.body.isActive;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );
  res.json(updatedUser);
  return;
});

export default userRouters;
