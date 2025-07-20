interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategorySelector({ selectedCategory, onCategorySelect }: CategorySelectorProps) {
  const categories = [
    { id: "chest", name: "Chest" },
    { id: "arm", name: "Arm" }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Select Category
      </label>
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
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