import connectToDatabase from "@app/lib/mongoose";
import Issue from "@models/Issue";

export async function fetchIssues() {
  try {
    await connectToDatabase();
    const issues = await Issue.find({})
      .sort({ createdAt: -1 })
      .populate("author", "name image")
      .lean();
    return JSON.parse(JSON.stringify(issues));
  } catch (error) {
    console.error("Error fetching issues:", error);
    return null;
  }
}

// You can add other issue-related actions here in the future
