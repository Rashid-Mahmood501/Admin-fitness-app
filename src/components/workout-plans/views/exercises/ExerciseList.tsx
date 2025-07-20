import { Exercise } from "../../types";
import { ExerciseCard } from "./ExerciseCard";
import { CategoryFilter } from "./CategoryFilter";

interface ExerciseListProps {
  exercises: Exercise[];
  filterCategory: string;
  onFilterChange: (category: string) => void;
  onCreateExercise: () => void;
  onEditExercise: (exerciseId: string) => void;
}

export function ExerciseList({
  exercises,
  filterCategory,
  onFilterChange,
  onCreateExercise,
  onEditExercise,
}: ExerciseListProps) {
  const filteredExercises = exercises.filter(exercise => 
    exercise.category === filterCategory
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#171616]">Excercises</h2>
        <button
          onClick={onCreateExercise}
          className="flex items-center space-x-2 px-4 py-2 border border-black rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">+</span>
          </div>
          <span className="text-black font-medium">Create Excercise</span>
        </button>
      </div>

      <CategoryFilter
        selectedCategory={filterCategory}
        onCategoryChange={onFilterChange}
      />

      <div className="space-y-8">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={() => onEditExercise(exercise.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No exercises found for {filterCategory} category</p>
          </div>
        )}
      </div>
    </div>
  );
} 