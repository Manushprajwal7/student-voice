// File: app/profile/page.js
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProblemCard from "../../components/ProblemCard";

const ProfilePage = () => {
  const { user } = useAuth();
  const [myIssues, setMyIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/issues`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Filter issues created by the current user
          const userIssues = data.filter((issue) => issue.creator === user.uid);
          setMyIssues(userIssues || []);
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch my issues:", error.message);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [user]);

  const deleteIssue = async (issueId) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        setMyIssues((prevIssues) =>
          prevIssues.filter((issue) => issue._id !== issueId)
        );
      } else {
        console.error("Failed to delete issue:", await response.text());
        alert("Failed to delete the issue. Please try again.");
      }
    } catch (error) {
      console.error("Failed to delete issue:", error.message);
      alert("Failed to delete the issue. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-20">
        Please sign in to view your profile.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <h2 className="text-xl font-semibold mb-2">My Issues</h2>
      {myIssues.length === 0 ? (
        <p>No issues found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myIssues.map((issue) => (
            <div key={issue._id} className="relative">
              <ProblemCard problem={issue} handleTagClick={() => {}} />
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded absolute bottom-2 right-2"
                onClick={() => deleteIssue(issue._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
