import { Router } from "express";

const permissionRouter = Router();

import { authenticate, authorize } from "../../middleware/authMiddleware";
import Role from "../../models/role";
import Permission from "../../models/permission";

permissionRouter.use(authenticate, authorize("master:permission"));

permissionRouter.post("/permissions", async (req, res) => {
  const { name } = req.body;
  const newPermission = new Permission({ name });
  await newPermission.save();
  res.json(newPermission);
});

permissionRouter.get("/permissions", async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
});

permissionRouter.get("/permissions/:id", async (req, res) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    res.status(404).json({ message: "Permission not found" });
    return;
  }
  res.json(permission);
});

permissionRouter.put("/permissions/:id", async (req, res) => {
  const { name } = req.body;
  const permission = await Permission.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  if (!permission) {
    res.status(404).json({ message: "Permission not found" });
    return;
  }
  res.json(permission);
});

permissionRouter.delete("/permissions/:id", async (req, res) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) {
    res.status(404).json({ message: "Permission not found" });
    return;
  }
  res.json({ message: "Permission deleted successfully" });
});

export default permissionRouter;
