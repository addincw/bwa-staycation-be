import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
  is_highlight: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("Category", schema);
