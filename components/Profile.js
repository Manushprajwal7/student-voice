// components/UserProfile.js
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.displayName || "N/A"}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
