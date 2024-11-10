// File: app/issues/[id]/IssueDetailsPage.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function IssueDetailsPage() {
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
      <h1 className="text-3xl font-bold mb-4">{issue.prompt}</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`${
              issue.status === "resolved" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {issue.status}
          </span>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Category:</span> {issue.category}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Created by:</span> {issue.creatorName}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {issue.creatorEmail}
        </p>
      </div>
    </div>
  );
}
