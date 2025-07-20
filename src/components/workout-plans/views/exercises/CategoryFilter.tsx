interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: "chest", name: "Chest" },
    { id: "arm", name: "Arm" }
  ];

  return (
    <div className="flex space-x-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
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
  );
} 