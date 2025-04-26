import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  permissions: mongoose.Types.ObjectId[];
}

const RoleSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true, unique: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
});

const Role = mongoose.model<IRole>("Role", RoleSchema);
export default Role;
