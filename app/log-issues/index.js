"use client";
import Form from "@/components/Form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";

const CreateIssue = () => {
  const router = useRouter();
  const { user } = UserAuth();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });

  const createIssue = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!user) return alert("You must be signed in to create an issue.");

    try {
      const response = await fetch("/api/issues/new_issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to create issue:", await response.text());
      }
    } catch (error) {
      console.error("Failed to create issue:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createIssue}
    />
  );
};

export default CreateIssue;
