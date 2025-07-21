import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { Category, CategorySelectionStepProps } from "../types";
import Loader from "@/components/Loader";

export function CategorySelectionStep({
  selectedDays,
  currentDay,
  dayCategories,
  dayExercises,
  onDayChange,
  onCategorySelection,
  onExerciseSelection,
  onCreatePlan,
}: CategorySelectionStepProps) {
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

  const getDayButtonClass = (day: number) => {
    if (currentDay === day) {
      return "bg-[#EC1D13] text-white";
    } else if (dayExercises[day] && dayExercises[day].length > 0) {
      return "bg-gray-600 text-white";
    } else if (dayCategories[day]) {
      return "bg-blue-500 text-white";
    } else {
      return "bg-white text-black border border-black hover:bg-gray-50";
    }
  };

  const isCreateButtonDisabled = () => {
    return (
      Object.keys(dayCategories).length !== selectedDays[0] ||
      Object.keys(dayExercises).length !== selectedDays[0]
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#171616] mb-6">
        Create Exercise Plan
      </h2>

      <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
        {Array.from({ length: selectedDays[0] }, (_, index) => index + 1).map(
          (day) => (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${getDayButtonClass(
                day
              )}`}
            >
              Day {day}
            </button>
          )
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#171616] mb-4">
          Day {currentDay}
        </h3>
        <p className="text-gray-600 mb-4">
          Select the category in which you want to add exercises for users
        </p>

        <div className="flex space-x-4 mb-6 overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="flex justify-center items-center w-1/4">
              <Loader />
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategorySelection(currentDay, category.name)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  dayCategories[currentDay] === category.name
                    ? "bg-[#EC1D13] text-white"
                    : "bg-white text-black border border-black hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>

        <div className="mt-8">
          <div
            onClick={dayCategories[currentDay] ? onExerciseSelection : undefined}
            className={`bg-white rounded-lg border border-black p-6 transition-all duration-200 w-64 ${
              dayCategories[currentDay]
                ? 'cursor-pointer hover:shadow-lg'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                dayCategories[currentDay] ? 'bg-black' : 'bg-gray-400'
              }`}>
                <span className="text-3xl font-bold text-white">+</span>
              </div>
            </div>
            <h3 className={`text-base font-medium text-center ${
              dayCategories[currentDay] ? 'text-[#171616]' : 'text-gray-500'
            }`}>
              Select Exercise
            </h3>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onCreatePlan}
          disabled={isCreateButtonDisabled()}
          className="px-8 py-1.5 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </>
  );
}
