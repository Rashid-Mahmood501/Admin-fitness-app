import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { Category } from "../../types";
import Loader from "@/components/Loader";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper("/admin/workout-category/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
      {loading ? (
        <div className="flex justify-center items-center w-1/2">
          <Loader />
        </div>
      ) : (
        categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.name
                ? "bg-[#EC1D13] text-white"
                : "bg-white text-black border border-black hover:bg-gray-50"
            }`}
          >
            {category.name}
          </button>
        ))
      )}
    </div>
  );
}
