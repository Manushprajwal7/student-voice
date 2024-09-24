// models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  authorId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add any other fields you need for your posts
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
