import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fileRouter from "./routes/fileRouter";
import connectDb from "./config/db";
import fs from "fs";
import folderRouter from "./routes/folderRouter";
import authRouter from "./routes/authRouter";
import { adminUserCreation, initialSetup } from "./config/initial";

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
