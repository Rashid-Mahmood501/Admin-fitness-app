interface MealOption {
  id: string;
  foodName: string;
  mealType: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image: string;
  preparation: string;
}

interface MealPlan {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  days: {
    day: number;
    mealOptions: MealOption[];
  }[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

interface CreatedMealPlansListProps {
  mealPlans: MealPlan[];
  onEditPlan: (mealPlan: MealPlan) => void;
  onCreateNew: () => void;
}

export default function CreatedMealPlansList({
  mealPlans,
  onEditPlan,
  onCreateNew,
}: CreatedMealPlansListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMealTypeCount = (mealPlan: MealPlan, mealType: string) => {
    return mealPlan.days.reduce((count, day) => {
      return (
        count +
        day.mealOptions.filter((meal) => meal.mealType === mealType).length
      );
    }, 0);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#171616]">Created Meal Plans</h2>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-[#EC1D13] text-white rounded-lg hover:bg-[#d41910] transition-colors font-medium flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create New Plan</span>
        </button>
      </div>

      {mealPlans?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No meal plans created yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first meal plan to get started
          </p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-[#EC1D13] text-white rounded-lg hover:bg-[#d41910] transition-colors font-medium"
          >
            Create Your First Meal Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealPlans?.map((mealPlan) => (
            <div
              key={mealPlan.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Meal Plan Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#171616] mb-1">
                    {mealPlan.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-[#EC1D13] text-white text-xs rounded-full capitalize">
                      {mealPlan.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {mealPlan.days.length} days
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEditPlan(mealPlan)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit</span>
                </button>
              </div>

              {/* Nutrition Summary */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Nutrition Summary
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-medium text-gray-600">
                      {mealPlan.totalCalories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein:</span>
                    <span className="font-medium text-gray-600">
                      {mealPlan.totalProtein}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat:</span>
                    <span className="font-medium text-gray-600">
                      {mealPlan.totalFat}g
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs:</span>
                    <span className="font-medium text-gray-600">
                      {mealPlan.totalCarbs}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Meal Type Breakdown */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Meal Breakdown
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["breakfast", "lunch", "dinner", "snacks"].map(
                    (mealType) => {
                      const count = getMealTypeCount(mealPlan, mealType);
                      if (count === 0) return null;
                      return (
                        <span
                          key={mealType}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                        >
                          {mealType}: {count}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Created Date */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Created on {formatDate(mealPlan.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
