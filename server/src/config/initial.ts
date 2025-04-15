import Permissions from "../models/permission";
import Role from "../models/role";
import User from "../models/user";
import bcrypt from "bcryptjs";

// Initial setup script
export async function initialSetup() {
  // Create permissions
  const readPermission = await Permissions.create({
    name: "file:read",
    description: "Read files",
  });
  const writePermission = await Permissions.create({
    name: "file:write",
    description: "Write files",
  });
  const deletePermission = await Permissions.create({
    name: "file:delete",
    description: "Delete files",
  });

  // Create roles
  const adminRole = await Role.create({
    name: "admin",
    permissions: [
      readPermission._id,
      writePermission._id,
      deletePermission._id,
    ],
  });

  const userRole = await Role.create({
    name: "user",
    permissions: [readPermission._id, writePermission._id],
  });
}

export async function adminUserCreation() {
  // Create initial admin user if none exists
  const adminRole = await Role.findOne({ name: "admin" });
  if (adminRole) {
    const adminExists = await User.exists({ role: adminRole._id });
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL!;
      const adminPassword = process.env.ADMIN_PASSWORD!;

      await User.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: adminRole._id,
      });
    }
  }
}
