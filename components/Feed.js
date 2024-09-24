// File: components/Feed.js
"use client";

import React, { useState, useEffect } from "react";
import ProblemCard from "./ProblemCard";
import { useAuth } from "../app/context/AuthContext";
import { useSearchParams } from "next/navigation";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const response = await fetch("/api/issues", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const issues = await response.json();
          setPosts(issues);
        } else {
          throw new Error("Failed to fetch issues");
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    }

    fetchAllIssues();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [category, posts, searchQuery]); // Re-run filter on category, posts, or search query change

  const filterPosts = () => {
    let filtered = posts;

    // Filter by category if selected
    if (category && category !== "All") {
      filtered = filtered.filter((post) => post.category === category);
    }

    // Filter by search query (username or tag)
    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      filtered = filtered.filter(
        (post) =>
          regex.test(post.creator?.username) || // Search by username
          regex.test(post.tag) // Search by tags
      );
    }

    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Recent Issues</h1>

      {/* Search Bar */}
      <form className="mb-8">
        <input
          type="text"
          placeholder="Search by username or tags"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((issue) => (
          <ProblemCard key={issue._id} problem={issue} currentUser={user} />
        ))}
      </div>
    </section>
  );
};

export default Feed;
