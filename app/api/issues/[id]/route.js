// app/api/issues/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Issue from "../../../../models/Issue";
import {
  initializeFirebaseAdmin,
  getAuth,
} from "../../../../utils/firebase-admin";

initializeFirebaseAdmin();
export async function GET(request, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const issue = await Issue.findById(id);

    if (!issue) {
      console.error(`Issue not found: ${id}`); // Debugging
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error(`Error fetching issue with ID ${id}:`, error);
    return NextResponse.json(
      { success: false, error: "Error fetching issue" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const auth = getAuth();
    await auth.verifyIdToken(token);

    await dbConnect();
    const updates = await request.json();
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status: updates.status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { success: false, error: "Error updating issue: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const auth = getAuth();
    await auth.verifyIdToken(token);

    await dbConnect();
    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return NextResponse.json(
        { success: false, error: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting issue: " + error.message },
      { status: 500 }
    );
  }
}
