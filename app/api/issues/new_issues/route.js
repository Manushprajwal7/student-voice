import { connectToDB } from "../../../../utils/db";
import Issue from "../../../../models/Issue";
import {
  getAuth,
  initializeFirebaseAdmin,
} from "../../../../utils/firebase-admin";

initializeFirebaseAdmin(); // Ensure Firebase is initialized

export const POST = async (req) => {
  let prompt, tag, category;
  try {
    ({ prompt, tag, category } = await req.json());
  } catch (error) {
    return new Response("Invalid request body", { status: 400 });
  }

  if (!prompt || !tag || !category) {
    return new Response("Invalid input: Missing prompt, tag, or category", {
      status: 400,
    });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;
    const creatorName = decodedToken.name || "Anonymous"; // Add this line

    await connectToDB();

    const newIssue = new Issue({
      creator: userId,
      creatorEmail: userEmail,
      creatorName, // Add the creatorName field
      prompt,
      tag,
      category,
    });

    await newIssue.save();

    return new Response(JSON.stringify(newIssue), { status: 201 });
  } catch (error) {
    return new Response(`Failed to create a new issue: ${error.message}`, {
      status: 500,
    });
  }
};
