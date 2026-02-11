import mongoose, { InferSchemaType } from "mongoose";

const showSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  img: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: false },
  type: { type: String, required: true },
  seasons: { type: Number, required: false },
  minutes: { type: Number, required: false },
  apiId: { type: String, required: true },
});

type ShowType = InferSchemaType<typeof showSchema>;

const Show = mongoose.model<ShowType>("Show", showSchema);

export { showSchema, ShowType };
export default Show;

// CJS compatibility — allows require("../models/Show") to return the model directly
module.exports = Show;
module.exports.default = Show;
module.exports.showSchema = showSchema;
