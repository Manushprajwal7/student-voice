import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Add other fields as needed
  },
  { timestamps: true }
);

export default mongoose.models.Problem ||
  mongoose.model("Problem", ProblemSchema);
