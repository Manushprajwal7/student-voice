// File: app/issues/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const categories = [
  "All",
  "Teaching",
  "Women Rights",
  "Ragging",
  "Cultural Events",
  "Campus",
  "Sports",
  "Fest",
  "Infrastructure",
  "Academics",
  "Student Services",
  "Extracurricular Activities",
];

async function createIssue(token, prompt, tag, category) {
  try {
    const response = await fetch("/api/issues/new_issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, tag, category }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error creating issue: ${errorMessage}`);
    }

    const result = await response.json();
    console.log("Issue created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

export default function IssuesPage() {
  const [prompt, setPrompt] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to create an issue.");
      return;
    }
    try {
      await createIssue(user.token, prompt, tag, category);
      setPrompt("");
      setTag("");
      setCategory("");
      alert("Issue created successfully!");
      router.push("/");
    } catch (error) {
      alert("Failed to create issue. Please try again.");
    }
  };

  const handleCancel = () => {
    setPrompt("");
    setTag("");
    setCategory("");
    router.push("/");
  };

  return (
    <section className="w-full max-w-4xl pt-20 mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Create New Issue
      </h1>
      <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Share your concerns with the college community. Your voice matters!
      </p>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your concern"
          required
          className="w-full h-40 p-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Add tags (comma-separated)"
          required
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            Create Issue
          </button>
        </div>
      </form>
    </section>
  );
}
