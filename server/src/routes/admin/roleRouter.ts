import { Router } from "express";
import { authenticate, authorize } from "../../middleware/authMiddleware";
import Role from "../../models/role";
import User from "../../models/user";

const roleRouter = Router();
roleRouter.use(authenticate, authorize("master:permission"));

roleRouter.post("/roles", async (req, res) => {
  const { name, permissions } = req.body;
  const newRole = new Role({ name, permissions });
  await newRole.save();
  res.json(newRole);
});

roleRouter.get("/roles", async (req, res) => {
  const roles = await Role.find()
    .select("_id name")
    .populate("permissions", "name");
  res.json(roles);
});

roleRouter.put("/roles/:id/permissions", async (req, res) => {
  const { permissions } = req.body;
  const role = await Role.findById(req.params.id);
  if (!role) {
    res.status(404).json({ message: "Role not found" });
    return;
  }
  role.permissions = permissions;
  await role.save();
  res.json(role);
});

roleRouter.delete("/roles/:id", async (req, res) => {
  // Check if the role is being used by any user
  const userWithRole = await User.findOne({ role: req.params.id });
  if (userWithRole) {
    res.status(400).json({ message: "Cannot delete role in use" });
    return;
  }
  // Check if the role is the master-admin role
  const masterAdminRole = await Role.findOne({ name: "master-admin" });
  if (req.params.id === masterAdminRole?._id.toString()) {
    res.status(400).json({ message: "Cannot delete master-admin role" });
    return;
  }

  const role = await Role.findById(req.params.id);
  if (!role) {
    res.status(404).json({ message: "Role not found" });
    return;
  }
  await role.deleteOne();
  res.json({ message: "Role deleted" });
});

export default roleRouter;
