// File: models/Issue.js
import { Schema, model, models } from "mongoose";

const IssueSchema = new Schema(
  {
    creator: {
      type: String,
      required: [true, "Creator is required."],
    },
    creatorEmail: {
      type: String,
      required: [true, "Creator email is required."],
    },
    creatorName: {
      type: String,
      required: [true, "Creator name is required."],
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required."],
    },
    tag: {
      type: String,
      required: [true, "Tag is required."],
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const Issue = models.Issue || model("Issue", IssueSchema);

export default Issue;
