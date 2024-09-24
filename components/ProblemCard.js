import React from "react";
import Link from "next/link";
import Image from "next/image";

const ProblemCard = ({ problem, handleTagClick }) => {
  const truncateText = (text, limit) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  if (!problem || !problem._id) {
    return (
      <div className="text-red-500 font-semibold">
        Error: Problem data is missing
      </div>
    );
  }

  const creatorName = problem.creatorName || "Anonymous";
  const creatorEmail = problem.creatorEmail || "No email";

  return (
    <Link href={`/issues/${problem._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {problem.creatorImage ? (
                  <Image
                    src={problem.creatorImage}
                    alt={creatorName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  creatorName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {creatorName}
                </h3>
                <p className="text-sm text-gray-500 truncate">{creatorEmail}</p>
              </div>
            </div>
            {problem.createdAt && (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(problem.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(problem.prompt, 30)}
          </p>

          {problem.tag && (
            <div className="flex flex-wrap gap-2 mt-4">
              {problem.tag.split(",").map((tag, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTagClick && handleTagClick(tag.trim());
                  }}
                >
                  #{tag.trim()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
