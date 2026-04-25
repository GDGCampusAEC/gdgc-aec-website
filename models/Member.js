import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    isPassout: {
      type: Boolean,
      default: false,
    },
    domain: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true },
);

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
