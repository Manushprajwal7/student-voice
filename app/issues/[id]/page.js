"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

export default function IssuePage() {
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchIssue();
    }
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
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
      <div className="mb-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Created by:</h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {issue.creatorImage ? (
              <Image
                src={issue.creatorImage}
                alt={issue.creatorName || "Creator"}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              (issue.creatorName || "A").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-lg">{issue.creatorName || "Anonymous"}</p>
            <p className="text-gray-600">{issue.creatorEmail || "No Email"}</p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">{issue.prompt}</h1>
      <p className="text-gray-600 mb-4">Status: {issue.status}</p>
      <p className="text-gray-600 mb-4">
        Category: {issue.category || "Uncategorized"}
      </p>
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
