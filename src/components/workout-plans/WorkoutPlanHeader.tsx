import { WorkoutPlanHeaderProps } from "./types";

export function WorkoutPlanHeader({ onBack }: WorkoutPlanHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">💪</span>
        <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
      </div>
      <button
        onClick={onBack}
        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Back to Workout Plans
      </button>
    </div>
  );
} 