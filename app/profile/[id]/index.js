/**app/profile/[id]/index.js */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}/posts`);
        if (response.ok) {
          const data = await response.json();
          setUserPosts(data);
        } else {
          console.error("Failed to fetch user posts:", await response.text());
        }
      } catch (error) {
        console.error("Failed to fetch user posts:", error.message);
      }
    };

    if (params.id) fetchPosts();
  }, [params.id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome ${userName}, do share your experiences`}
      data={userPosts}
    />
  );
};

export default UserProfile;
