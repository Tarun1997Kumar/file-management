import mongoose, { Schema, Document, mongo } from "mongoose";

interface File extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  size: number;
  type: string;
  created_at: Date;
  updated_at: Date;
  is_folder: boolean;
  path: string;
  userId: mongoose.Schema.Types.ObjectId;
  parentId?: string;
}

const fileSchema: Schema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_folder: { type: Boolean, required: true },
  path: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentId: { type: String, default: null },
});

fileSchema.pre<File>("save", function (next) {
  this.updated_at = new Date();
  next();
});

const File = mongoose.model<File>("File", fileSchema);

export default File;
