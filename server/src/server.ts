import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fileRouter from "./routes/fileRouter";
import connectDb from "./config/db";
import fs from "fs";
import folderRouter from "./routes/folderRouter";
import authRouter from "./routes/authRouter";
import { adminUserCreation, initialSetup } from "./config/initial";
import User from "./models/user";
import File from "./models/file";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/file", fileRouter);
app.use("/api/folder", folderRouter);
app.use("/api/auth", authRouter);
connectDb();
// initialSetup();
adminUserCreation();

if (!fs.existsSync("root")) {
  fs.mkdirSync("root");
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
app.get("/api/admin/users", authenticate, async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
});
app.get("/api/admin/files", authenticate, async (req, res) => {
  const files = await File.find;
  res.json(files);
});
app.put("/api/admin/users/:id/role", authenticate, async (req, res) => {
  const { roleId } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role: roleId },
    { new: true }
  );
  res.json(updatedUser);
});
app.delete("/api/admin/files/:id", authenticate, async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
