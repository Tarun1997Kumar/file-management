import mongoose, { Document, Schema } from "mongoose";
import Role from "./role";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: { type: mongoose.Types.ObjectId; ref: "Role"; required: true };
  isActive: boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    default: async () => {
      return await Role.findOne({ name: "user" });
    },
  },
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
