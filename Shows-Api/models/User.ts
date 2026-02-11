import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.model<UserType>("User", userSchema);

export { userSchema, UserType };
export default User;

// CJS compatibility — allows require("../models/User") to return the model directly
module.exports = User;
module.exports.default = User;
module.exports.userSchema = userSchema;
