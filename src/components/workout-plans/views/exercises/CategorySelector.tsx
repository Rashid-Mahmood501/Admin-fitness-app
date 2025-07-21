import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { Category } from "../../types";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategorySelector({
  selectedCategory,
  onCategorySelect,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = async () => {
    const response = await fetchWrapper("/admin/workout-category/all");
    setCategories(response.data);
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
        {categories.map((category) => (
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
        ))}
      </div>
    </div>
  );
}
