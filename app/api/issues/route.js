import dbConnect from "../../lib/dbConnect";
import Issue from "../../../models/Issue";

export async function GET(request) {
  try {
    await dbConnect();
    const issues = await Issue.find({})
      .sort({ createdAt: -1 }) // Sort in descending order
      .populate("creator") // Populate creator field if needed
      .exec();

    return new Response(JSON.stringify(issues), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return new Response("Failed to fetch issues", { status: 500 });
  }
}
