import mongoose, { Schema } from "mongoose";

export interface IPermission extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
}

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const Permissions = mongoose.model<IPermission>("Permission", PermissionSchema);
export default Permissions;
