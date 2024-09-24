// File: components/CategoryDropdown.js
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  "All",
  "Teaching",
  "Women Rights",
  "Ragging",
  "Cultural Events",
  "Campus",
  "Sports",
  "Fest",
  "Infrastructure",
  "Academics",
  "Student Services",
  "Extracurricular Activities",
];

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleCategorySelect = (category) => {
    setIsOpen(false);
    if (category === "All") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
      >
        Categories
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
