import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Issue from "../../../../models/Issue";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const issue = await Issue.findById(id).populate("creator");

    if (!issue) {
      console.error(`Issue with ID ${id} not found.`);
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching issue" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const { prompt, tag } = await request.json();

  try {
    await dbConnect();

    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      console.error(`Issue with ID ${id} not found for update.`);
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    existingIssue.prompt = prompt;
    existingIssue.tag = tag;
    await existingIssue.save();

    console.log(`Issue with ID ${id} updated successfully.`);
    return NextResponse.json({
      success: true,
      message: "Issue updated successfully",
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { success: false, error: "Error updating issue" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();

    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      console.error(`Issue with ID ${id} not found for deletion.`);
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    console.log(`Issue with ID ${id} deleted successfully.`);
    return NextResponse.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting issue" },
      { status: 500 }
    );
  }
}
