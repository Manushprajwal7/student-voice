// app/api/issues/new_issues/route.js
import { connectToDB } from "../../../../utils/db";
import Issue from "../../../../models/Issue";
import {
  getAuth,
  initializeFirebaseAdmin,
} from "../../../../utils/firebase-admin";

initializeFirebaseAdmin();

export const POST = async (req) => {
  try {
    const { prompt, tag, category } = await req.json();
    if (!prompt || !tag || !category) {
      return new Response("Missing required fields: prompt, tag, or category", {
        status: 400,
      });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    await connectToDB();

    const newIssue = new Issue({
      creator: decodedToken.uid,
      creatorEmail: decodedToken.email,
      creatorName: decodedToken.name || "Anonymous",
      prompt,
      tag,
      category,
    });

    await newIssue.save();

    return new Response(JSON.stringify(newIssue), { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return new Response(`Failed to create a new issue: ${error.message}`, {
      status: 500,
    });
  }
};
