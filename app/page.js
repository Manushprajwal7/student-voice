// app/page.js
"use client";
import React, { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { useAuth } from "./context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    async function loadIssues() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch("/api/issues", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const issuesData = await response.json();
          setIssues(issuesData);
        } else {
          throw new Error("Failed to fetch issues");
        }
      } catch (error) {
        console.error("Error loading issues:", error);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, [user]);

  let filteredIssues;
  if (user && user.isAdmin) {
    // Show all issues for admins
    filteredIssues = issues;
  } else {
    // Filter issues by category for normal users
    filteredIssues =
      category && category !== "All"
        ? issues.filter((issue) => issue.category === category)
        : issues;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 pt-10 sm:p-24">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 pt-10 sm:p-24">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 pt-10 sm:p-24 ">
      <section className="w-full max-w-4xl mx-auto px-4 py-8 pt-10 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          <span className="text-black mt-3 pt-8">Student Voice</span>
          <br className="hidden sm:block" />
          <span className="text-black">College Community Concerns</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Explore issues raised by students in our college community. Voice your
          support and make a difference.
        </p>

        {user ? (
          <Feed initialIssues={filteredIssues} />
        ) : (
          <div
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8"
            role="alert"
          >
            <p className="font-bold">Please log in</p>
            <p>You need to be logged in to view and interact with issues.</p>
          </div>
        )}
      </section>
    </main>
  );
}
