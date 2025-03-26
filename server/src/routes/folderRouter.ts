import path from "path";
import File from "../models/file";
import express, { Request, Response } from "express";
import fs from "fs";
import { authenticate } from "../middleware/authMiddleware";
const folderRouter = express.Router();

folderRouter.post("/", authenticate, async (req: Request, res: Response) => {
  const { folderName, parentId } = req.body;
  const { userId } = req.body.user;
  if (!folderName || typeof folderName !== "string") {
    res
      .status(400)
      .json({ message: "Folder name is required and must be a string" });
    return;
  }

  const existingFolder = await File.findOne({
    name: folderName,
    parentId: parentId || null,
    userId,
    is_folder: true,
  });
  if (existingFolder) {
    res.status(400).json({
      message: `A folder named "${folderName}" already exists at this location`,
    });
    return;
  }

  try {
    const parentFolder = await File.findOne({ _id: parentId, userId: userId });
    const folderPath = parentFolder
      ? path.posix.join(parentFolder.path, folderName)
      : path.posix.join("root", userId, folderName);

    const newFolder = new File({
      name: folderName,
      is_folder: true,
      path: folderPath,
      userId: userId,
      type: "folder",
      size: 0,
      parentId: parentId,
    });

    // Ensure directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    await File.create(newFolder);
    res.status(201).json({ message: `${folderName} created successfully` });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `${folderName} creating file: ${error.message}` });
  }
});

folderRouter.delete(
  "/:folderId",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const folderId = req.params.folderId;

      const folder = await File.findById(folderId);
      if (!folder || !folder.is_folder) {
        res.status(404).json({ message: "Folder not found" });
        return;
      }

      // Function to recursively delete subfolders and files
      const deleteFolderContents = async (parentId: any) => {
        const items = await File.find({ parentId });

        for (const item of items) {
          if (item.is_folder) {
            // Recursively delete subfolders
            await deleteFolderContents(item._id);
          } else {
            // Delete physical file from disk
            try {
              fs.unlinkSync(item.path);
            } catch (err) {
              console.error(`Failed to delete file: ${item.path}`, err);
            }
          }
          // Delete file/folder
          await File.findByIdAndDelete(item._id);
        }
      };

      // Start recursive deletion
      await deleteFolderContents(folderId);

      // Remove physical folder
      try {
        fs.rmSync(folder.path, { recursive: true, force: true });
      } catch (err) {
        console.error(`Failed to delete folder: ${folder.path}`, err);
      }

      // Finally, delete the folder itself
      await File.findByIdAndDelete(folderId);

      res
        .status(200)
        .json({ message: "Folder and contents deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting folder" });
    }
  }
);

export default folderRouter;
