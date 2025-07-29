"use client";
import { useState, useEffect } from "react";
import { WorkoutPlan, Exercise } from "./types";

interface WorkoutPlanEditFormProps {
  workoutPlan: WorkoutPlan;
  onSave: (updatedPlan: WorkoutPlan) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function WorkoutPlanEditForm({
  workoutPlan,
  onSave,
  onCancel,
  loading = false,
}: WorkoutPlanEditFormProps) {
  const [formData, setFormData] = useState<WorkoutPlan>(workoutPlan);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setFormData(workoutPlan);
    const dummyExercises: Exercise[] = [
      {
        _id: "1",
        name: "Push-ups",
        category: "strength",
        reps: "10-15",
        setType: "3 sets",
        image: "/placeholder.png",
        muscleGroup: "chest",
      },
      {
        _id: "2",
        name: "Squats",
        category: "strength",
        reps: "12-15",
        setType: "3 sets",
        image: "/placeholder.png",
        muscleGroup: "legs",
      },
      {
        _id: "3",
        name: "Pull-ups",
        category: "strength",
        reps: "8-12",
        setType: "3 sets",
        image: "/placeholder.png",
        muscleGroup: "back",
      },
    ];
    setExercises(dummyExercises);
  }, [workoutPlan]);

  const handleInputChange = (field: keyof WorkoutPlan, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDayCategoryChange = (day: number, category: string) => {
    setFormData((prev) => ({
      ...prev,
      dayCategories: {
        ...prev.dayCategories,
        [day]: category,
      },
    }));
  };

  const handleExerciseToggle = (day: number, exerciseId: string) => {
    setFormData((prev) => {
      const currentExercises = prev.dayExercises[day] || [];
      const updatedExercises = currentExercises.includes(exerciseId)
        ? currentExercises.filter((id) => id !== exerciseId)
        : [...currentExercises, exerciseId];

      return {
        ...prev,
        dayExercises: {
          ...prev.dayExercises,
          [day]: updatedExercises,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated workout plan data:", formData);
    onSave(formData);
  };

  const getPlanTypeTitle = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "muscle-mass": "Muscle Mass",
      "weight-loss": "Weight Loss",
      "bulk-up": "Bulk Up",
    };
    return typeMap[type] || type;
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex._id === exerciseId);
    return exercise?.name || "Unknown Exercise";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#171616]">Edit Workout Plan</h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Type
            </label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-black">
              {getPlanTypeTitle(formData.type)}
            </div>
          </div>
        </div>

        {/* Days and Categories */}
        <div>
          <h3 className="text-lg font-semibold text-[#171616] mb-4">
            Days and Categories
          </h3>
          <div className="space-y-4">
            {formData.selectedDays.map((day) => (
              <div
                key={day}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#171616]">Day {day}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.dayCategories[day] || ""}
                      onChange={(e) =>
                        handleDayCategoryChange(day, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                      <option value="">Select Category</option>
                      <option value="chest">Chest</option>
                      <option value="back">Back</option>
                      <option value="legs">Legs</option>
                      <option value="shoulders">Shoulders</option>
                      <option value="arms">Arms</option>
                      <option value="core">Core</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Exercises ({formData.dayExercises[day]?.length || 0})
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 text-black">
                      {formData.dayExercises[day]?.length > 0 ? (
                        <div className="space-y-1">
                          {formData.dayExercises[day].map((exerciseId) => (
                            <div
                              key={exerciseId}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{getExerciseName(exerciseId)}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleExerciseToggle(day, exerciseId)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No exercises selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exercise Selection */}
                {formData.dayCategories[day] && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Exercises
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto text-black">
                      {exercises
                        .filter(
                          (exercise) =>
                            exercise.muscleGroup === formData.dayCategories[day]
                        )
                        .map((exercise) => (
                          <label
                            key={exercise._id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.dayExercises[day]?.includes(
                                exercise._id
                              )}
                              onChange={() =>
                                handleExerciseToggle(day, exercise._id)
                              }
                              className="rounded"
                            />
                            <span className="text-sm">{exercise.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
} 