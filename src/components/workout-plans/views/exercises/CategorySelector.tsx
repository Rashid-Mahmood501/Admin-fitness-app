import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { Category } from "../../types";
import Loader from "@/components/Loader";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategorySelector({
  selectedCategory,
  onCategorySelect,
}: CategorySelectorProps) {
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
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Select Category
      </label>
      <div className="flex space-x-4">
        {loading ? (
          <div className="flex justify-center items-center w-1/2">
            <Loader />
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category.name)}
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
    </div>
  );
}
