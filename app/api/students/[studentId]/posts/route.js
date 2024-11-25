"use client";
import { connectToDB } from "../../../../../utils/db";
import Post from "../../../../../models/post";

export async function GET(req, { params }) {
  const { studentId } = params;

  try {
    console.log("Fetching posts for student:", studentId);

    // Connect to the database
    await connectToDB();

    // Fetch posts for the given student ID
    const posts = await Post.find({ studentId: studentId });

    console.log("Posts fetched successfully");
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching posts", details: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { studentId } = params;
  const { postId } = await req.json(); // Assuming postId is sent in the request body

  try {
    console.log("Attempting to delete post for student:", studentId);

    // Connect to the database
    await connectToDB();

    // Delete the post for the given student ID and post ID
    await Post.findOneAndDelete({ _id: postId, studentId: studentId });

    console.log("Post deleted successfully");
    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({ error: "Error deleting post", details: error.message }),
      { status: 500 }
    );
  }
}
