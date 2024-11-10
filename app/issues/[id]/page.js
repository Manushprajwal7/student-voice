// File: app/issues/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";

export default function IssuePage() {
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const params = useParams();
  const router = useRouter();
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
          Authorization: `Bearer ${user?.token}`, // Include token if available
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

  const resolveIssue = async () => {
    if (!user?.token) {
      setError("You must be logged in to resolve issues");
      return;
    }

    setIsResolving(true);
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: "resolved" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resolve issue");
      }

      setShowConfirmation(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error resolving issue:", error);
      setError(error.message);
    } finally {
      setIsResolving(false);
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
      <p className="text-gray-600 mb-4">
        Status:
        <span
          className={`${
            issue.status === "resolved" ? "text-green-600" : "text-blue-600"
          } ml-2`}
        >
          {issue.status}
        </span>
      </p>
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

      {/* Resolve Button for Admins */}
      {user?.isAdmin && issue.status !== "resolved" && (
        <button
          onClick={resolveIssue}
          disabled={isResolving}
          className={`mt-8 px-6 py-2 bg-green-600 text-white rounded-lg 
            ${
              isResolving
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }
            transition duration-200`}
        >
          {isResolving ? "Resolving..." : "Resolve this issue"}
        </button>
      )}

      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-green-600 font-semibold text-lg">
              Issue resolved successfully!
            </p>
            <p className="text-gray-600 mt-2">Redirecting to homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
}
