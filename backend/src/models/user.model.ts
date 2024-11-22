import { Schema, model, Document } from "mongoose";
import { User as UserType } from "../../../shared/types/user";

type UserDocument = UserType & Document;

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["resident", "owner"],
    required: true,
  },
}, { timestamps: true });

const User = model<UserDocument>('User', userSchema);

export default User;
