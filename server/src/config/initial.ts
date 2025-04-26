import Permissions from "../models/permission";
import Role from "../models/role";
import User from "../models/user";
import bcrypt from "bcryptjs";

// Initial setup script
export async function initialSetup() {
  // check master permission already exists
  let masterPermission = await Permissions.findOne({
    name: "master:permission",
  });
  if (!masterPermission) {
    masterPermission = await Permissions.create({
      name: "master:permission",
      description: "full access",
    });
  }

  let userfullAccessPermission = await Permissions.findOne({
    name: "file:fullaccess",
  });
  if (!userfullAccessPermission) {
    userfullAccessPermission = await Permissions.create({
      name: "file:fullaccess",
      description: "user will full access over his own files.",
    });
  }

  // cheeck if the permission already exists
  let fileReadPermission = await Permissions.findOne({
    name: "file:read",
  });
  if (!fileReadPermission) {
    fileReadPermission = await Permissions.create({
      name: "file:read",
      description: "user can view files only",
    });
  }
  let fileUploadPermission = await Permissions.findOne({
    name: "file:upload",
  });
  if (!fileUploadPermission) {
    fileUploadPermission = await Permissions.create({
      name: "file:upload",
      description: "user can upload files only",
    });
  }
  let fileDeletePermission = await Permissions.findOne({
    name: "file:delete",
  });
  if (!fileDeletePermission) {
    fileDeletePermission = await Permissions.create({
      name: "file:delete",
      description: "user can delete files only",
    });
  }

  let fileRenamePermission = await Permissions.findOne({
    name: "file:rename",
  });
  if (!fileRenamePermission) {
    fileRenamePermission = await Permissions.create({
      name: "file:rename",
      description: "user can rename files only",
    });
  }

  let fileDownloadPermission = await Permissions.findOne({
    name: "file:download",
  });
  if (!fileDownloadPermission) {
    fileDownloadPermission = await Permissions.create({
      name: "file:download",
      description: "user can download files only",
    });
  }

  // Create roles
  const adminRole = await Role.findOne({ name: "master-admin" });
  !adminRole &&
    (await Role.create({
      name: "master-admin",
      permissions: [masterPermission._id],
    }));
  const userRole = await Role.findOne({ name: "user" });
  !userRole &&
    (await Role.create({
      name: "user",
      permissions: [
        fileReadPermission?._id,
        fileUploadPermission?._id,
        fileDeletePermission?._id,
        fileDownloadPermission?._id,
        userfullAccessPermission?.id,
      ],
    }));
}

export async function adminUserCreation() {
  // Create initial admin user if none exists
  const adminRole = await Role.findOne({ name: "master-admin" });
  if (adminRole) {
    const adminExists = await User.exists({ role: adminRole._id });
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL!;
      const adminPassword = process.env.ADMIN_PASSWORD!;

      await User.create({
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: adminRole._id,
        isActive: true,
      });
    }
  }
}
