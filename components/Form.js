"use client";
import Link from "next/link";
import PropTypes from "prop-types";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  async function createIssue(userId, prompt, tag) {
    // Validate userId format
    if (
      typeof userId !== "string" ||
      userId.length !== 24 ||
      !/^[a-fA-F0-9]{24}$/.test(userId)
    ) {
      console.error("Invalid userId format:", userId);
      return;
    }

    try {
      const response = await fetch("/api/issues/new_issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, prompt, tag }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error creating issue: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Issue created successfully:", result);
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-left">
        {type} Issue
      </h1>
      <p className="text-gray-600 mb-8 text-left">
        {type} and share your concerns with the college, and let your concern
        reach everyone on this platform.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="concern"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Concern
          </label>
          <textarea
            id="concern"
            value={post?.prompt || ""}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Describe your concern here"
            required
            className="w-full h-40 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags{" "}
            <span className="text-gray-500">
              (e.g., #TOCE, #Culturals, #Sports)
            </span>
          </label>
          <input
            id="tags"
            value={post?.tag || ""}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            type="text"
            placeholder="#Tag"
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 text-sm"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

Form.propTypes = {
  type: PropTypes.string.isRequired,
  post: PropTypes.shape({
    prompt: PropTypes.string,
    tag: PropTypes.string,
  }),
  setPost: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Form;
