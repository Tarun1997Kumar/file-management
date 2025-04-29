import File from "../models/file";
import express, { Request, Response } from "express";
import multerDBStore from "../config/multer";
import path from "path";
import mongoose from "mongoose";
import fs from "fs";
import { authenticate, authorize } from "../middleware/authMiddleware";

const fileRouter = express.Router();

fileRouter.use(authenticate);

fileRouter.get(
  "/:parentId?",
  authorize(["file:read", "file:fullaccess"]),
  async (req: Request, res: Response) => {
    const { userId } = req.body.user;
    const parentId = req.params.parentId as string | undefined;
    try {
      const query: any = { userId };
      if (parentId) {
        query.parentId = new mongoose.Types.ObjectId(parentId as string);
      } else {
        query.parentId = null;
      }

      const children = await File.find(query);

      let currentFolder = null;
      if (parentId) {
        currentFolder = await File.findById(parentId);
        if (!currentFolder) {
          res.status(404).json({ message: "Folder not found" });
          return;
        }
      }

      const breadcrumbs: any[] = [];
      let currentParentId = parentId;
      while (currentParentId) {
        const parentFolder = await File.findById(currentParentId);
        if (parentFolder) {
          breadcrumbs.unshift({
            _id: parentFolder._id,
            name: parentFolder.name,
            parentId: parentFolder.parentId,
          });
          currentParentId = parentFolder.parentId ?? undefined;
        } else {
          break;
        }
      }

      res.status(200).json({ currentFolder, children, breadcrumbs });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user files",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

fileRouter.post(
  "/upload",
  authorize(["file:upload", "file:fullaccess"]),
  (req, res, next) => {
    const user = req.body.user;
    multerDBStore.single("file")(req, res, (err) => {
      if (err) return next(err);
      req.body.user = user;
      next();
    });
  },
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const fileName = req.file.originalname;
    const { userId } = req.body.user;
    const parentId = req.body?.parentId;

    const existingFile = await File.findOne({
      name: fileName,
      parentId: parentId,
      userId: userId,
    });
    if (existingFile) {
      res.status(400).json({ message: "A file with this name already exists" });
      return;
    }

    let dirPath = path.posix.join("root", userId); // Default to root directory

    if (parentId) {
      const parentFolder = parentId ? await File.findById(parentId) : null;
      if (parentFolder && parentFolder.is_folder) {
        dirPath = parentFolder.path; // Store inside the parent folder
      }
    }

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.posix.join(dirPath, fileName);

    const fileMetadata = new File({
      name: fileName,
      size: req.file.size,
      path: filePath,
      type: req.file.mimetype,
      is_folder: false,
      userId: userId,
      parentId: parentId,
    });

    await fs.promises.writeFile(filePath, req.file.buffer);

    try {
      await File.create(fileMetadata);
      res.status(201).json({ message: "File created successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error creating file",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

fileRouter.delete(
  "/:fileId",
  authorize(["file:delete", "file:fullaccess"]),
  async (req, res) => {
    try {
      const file = await File.findById(req.params.fileId);
      if (!file || file.is_folder) {
        res.status(404).json({ message: "File/Folder not found" });
        return;
      }

      // Delete physical file from disk
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error(`Failed to delete file: ${file.path}`, err);
        }
      }

      await File.findByIdAndDelete(req.params.fileId);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting file",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

fileRouter.patch(
  "/:fileId/rename",
  authorize(["file:rename", "file:fullaccess"]),
  async (req: Request, res: Response) => {
    try {
      const { fileId } = req.params;
      const { newName } = req.body;

      const file = await File.findById(fileId);
      if (!file) {
        res.status(404).json({ message: "File/Folder not found" });
        return;
      }

      // Update the name and path
      const updatedPath = path.posix.join(path.dirname(file.path), newName);

      // Rename file/folder on disk
      try {
        fs.renameSync(file.path, updatedPath);
      } catch (err) {
        console.error(`Failed to rename file: ${file.path}`, err);
      }

      // Update MongoDB records for nested items
      if (file.is_folder) {
        const updateChildPaths = async (
          parentId: string,
          oldBasePath: string,
          newBasePath: string
        ) => {
          const children = await File.find({ parentId });
          for (const child of children) {
            const newChildPath = child.path.replace(oldBasePath, newBasePath);
            await File.findByIdAndUpdate(child._id, { path: newChildPath });
            if (child.is_folder) {
              await updateChildPaths(child._id + "", oldBasePath, newBasePath);
            }
          }
        };

        await updateChildPaths(file._id + "", file.path, updatedPath);
      }

      file.name = newName;
      file.path = updatedPath;

      await file.save();
      res
        .status(200)
        .json({ message: "File/Folder renamed successfully", file });
    } catch (error) {
      res.status(500).json({
        message: "Error renaming file/folder",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

fileRouter.put(
  "/:fileId/move",
  authorize(["file:move", "file:fullaccess"]),
  async (req: Request, res: Response) => {
    try {
      const newParentId = req.body.newParentId;
      const { userId } = req.body.user;

      // Fetch the file/folder being moved
      const file = await File.findById(req.params.fileId);
      if (!file) {
        res.status(404).json({ message: "File/Folder not found" });
        return;
      }

      // Fetch the new parent folder (if newParentId is provided)
      const newParentFolder = newParentId
        ? await File.findById(newParentId)
        : null;

      // Validate that the new parent is a folder (if specified)
      if (newParentId && !newParentFolder?.is_folder) {
        res.status(400).json({ message: "New parent is not a folder" });
        return;
      }

      // Prevent moving a folder into itself
      // Convert newParentId to ObjectId for comparison
      if (newParentId && newParentId == file._id.toString()) {
        res.status(400).json({ message: "Cannot move a folder into itself" });
        return;
      }

      // Prevent circular references (e.g., moving a parent into its child)
      const checkCircularReference = async (
        fileId: string,
        newParentId: string | undefined
      ): Promise<boolean> => {
        let currentId = newParentId;
        while (currentId) {
          if (currentId === fileId) {
            return true; // Circular reference detected
          }
          const parentFolder = await File.findById(currentId);
          currentId = parentFolder?.parentId ?? undefined;
        }
        return false;
      };

      if (
        newParentId &&
        (await checkCircularReference(file._id.toString(), newParentId))
      ) {
        res
          .status(400)
          .json({ message: "Cannot move a folder into its own subtree" });
        return;
      }

      // Construct the new path
      let dirPath = path.posix.join("root", userId);
      const newPath = newParentFolder
        ? path.posix.join(newParentFolder.path, file.name)
        : path.posix.join(dirPath, file.name);

      // Move file/folder on disk
      try {
        await fs.promises.rename(file.path, newPath);
      } catch (err) {
        console.error(`Failed to move file: ${file.path}`, err);
        res
          .status(500)
          .json({ message: "Failed to move file on disk", error: String(err) });
        return;
      }

      // Update MongoDB for folder children (if the item is a folder)
      if (file.is_folder) {
        const updateChildPaths = async (
          parentId: string,
          oldBasePath: string,
          newBasePath: string
        ) => {
          const children = await File.find({ parentId });
          for (const child of children) {
            const newChildPath = child.path.replace(oldBasePath, newBasePath);
            await File.findByIdAndUpdate(child._id, { path: newChildPath });
            if (child.is_folder) {
              await updateChildPaths(
                child._id.toString(),
                oldBasePath,
                newBasePath
              );
            }
          }
        };

        await updateChildPaths(file._id.toString(), file.path, newPath);
      }

      // Update MongoDB record for the moved file/folder
      file.path = newPath;
      file.parentId = newParentId;
      await file.save();

      res.status(200).json({ message: "File moved successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Error moving file",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

fileRouter.get(
  "/download",
  authorize(["file:download", "file:fullaccess"]),
  async (req, res) => {
    try {
      const filePath = decodeURIComponent(req.query.filePath as string);
      const absolutePath = path.join(__dirname, "../../", filePath);

      res.download(absolutePath, (err) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Error downloading file", error: err });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error downloading file", error });
    }
  }
);
export default fileRouter;
