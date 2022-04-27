import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  account_owner: { type: String, required: true },
  account_number: { type: String, required: true },
  logo: String,
  is_active: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.model("Bank", schema);
