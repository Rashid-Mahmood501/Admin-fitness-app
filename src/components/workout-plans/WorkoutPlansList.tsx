"use client";
import { WorkoutPlan } from "./types";

interface WorkoutPlansListProps {
  workoutPlans: WorkoutPlan[];
  onEditPlan: (plan: WorkoutPlan) => void;
  onCreateNew: () => void;
}

export default function WorkoutPlansList({
  workoutPlans,
  onEditPlan,
  onCreateNew,
}: WorkoutPlansListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanTypeTitle = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "muscle-mass": "Muscle Mass",
      "weight-loss": "Weight Loss",
      "bulk-up": "Bulk Up",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#171616]">
          Existing Workout Plans
        </h2>
        <button
          onClick={onCreateNew}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create New Plan
        </button>
      </div>

      {workoutPlans.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No workout plans yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first workout plan to get started
          </p>
          <button
            onClick={onCreateNew}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#171616] mb-1">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getPlanTypeTitle(plan.type)}
                  </p>
                </div>
                <button
                  onClick={() => onEditPlan(plan)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Days:</span>
                  <span>{plan.selectedDays.length} day(s)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Created:</span>
                  <span>{formatDate(plan.createdAt)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Exercises per day:</span>
                  <div className="mt-1 space-y-1">
                    {plan.selectedDays.map((day) => (
                      <div key={day} className="flex justify-between">
                        <span>Day {day}:</span>
                        <span>
                          {plan.dayExercises[day]?.length || 0} exercises
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 