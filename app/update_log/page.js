"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "../../components/Form";
const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");

  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getPromptDetails = async () => {
      try {
        const response = await fetch(`/api/issues/${promptId}`);
        if (response.ok) {
          const data = await response.json();
          setPost({ prompt: data.prompt, tag: data.tag });
        } else {
          console.error(
            "Failed to fetch prompt details:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Failed to fetch prompt details:", error.message);
      }
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) return alert("Missing LogId!");

    try {
      const response = await fetch(`/api/issues/${promptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to update prompt:", await response.text());
      }
    } catch (error) {
      console.error("Failed to update prompt:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default UpdatePrompt;
