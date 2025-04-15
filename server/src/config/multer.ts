import multer, { Options } from "multer";
import File from "../models/file";
import { Request } from "express";
import fs from "fs";

const multerOptions: Options = {
  storage: multer.memoryStorage(),
};

const multerDBStore = multer(multerOptions);

export default multerDBStore;
