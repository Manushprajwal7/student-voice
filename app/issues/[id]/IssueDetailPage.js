// File: app/issues/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function IssuePage() {
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchIssue();
    }
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch issue");
      }
      const data = await response.json();
      setIssue(data.data);
    } catch (err) {
      setError("Error fetching issue");
      console.error("Error fetching issue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!issue) return <div className="text-center mt-20">No issue found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      {issue.creator && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Created by:</h2>
          <p>{issue.creator.username}</p>
          <p>{issue.creator.email}</p>
        </div>
      )}
      <h3 className="text-3xl font-bold mb-4">{issue.prompt}</h3>
      <p className="text-gray-600 mb-4">Status: {issue.status}</p>
      <p className="text-gray-600 mb-4">
        Created at: {new Date(issue.createdAt).toLocaleString()}
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Tags:</h2>
        <div className="flex flex-wrap gap-2">
          {issue.tag.split(",").map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
