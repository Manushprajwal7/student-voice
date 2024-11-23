//components/navigation.js

"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import CategoryDropdown from "./CategoryDropdown";

const Navigation = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const { user, googleSignIn, logOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error during sign in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("Error during sign out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-4 py-3 flex justify-between items-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/assets/logo.svg"
          alt="Student Voice logo"
          width={39}
          height={39}
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        {/* Updated text visibility and size for different screen sizes */}
        <p className="block font-sans font-semibold text-sm text-gray-800 sm:text-lg">
          Student Voice
        </p>
      </Link>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <CategoryDropdown /> {/* Add this line */}
        {user ? (
          <>
            <Link
              href="/issues"
              className="rounded-full bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium transition-colors hover:bg-blue-700"
            >
              Log an Issue
            </Link>

            <div className="relative">
              <Image
                src={user.photoURL || "/assets/default-profile.svg"}
                width={32}
                height={32}
                className="rounded-full cursor-pointer sm:w-10 sm:h-10"
                alt="User Profile"
                onClick={() => setToggleDropdown((prev) => !prev)}
              />
              {toggleDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setToggleDropdown(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            className="rounded-full bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium transition-colors hover:bg-blue-700"
          >
            Sign in With Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
