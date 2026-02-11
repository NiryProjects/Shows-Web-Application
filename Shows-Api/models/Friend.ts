import mongoose, { InferSchemaType } from "mongoose";

const friendSchema = new mongoose.Schema({
  usernameId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friends: [
    {
      friendUsername: { type: String },
      friendId: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
});

type FriendType = InferSchemaType<typeof friendSchema>;

const Friend = mongoose.model<FriendType>("Friend", friendSchema);

export { friendSchema, FriendType };
export default Friend;
