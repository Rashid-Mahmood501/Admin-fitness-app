"use client";

import { useState } from "react";
import Image from "next/image";
import { WorkoutPlanHeader } from "../WorkoutPlanHeader";
import { ExerciseForm } from "../types";

interface ExercisesViewProps {
  onBack: () => void;
}

export function ExercisesView({ onBack }: ExercisesViewProps) {
  const [showCreateExerciseForm, setShowCreateExerciseForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("chest");
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
    workoutName: "",
    setType: "",
    video: null,
    muscleGroup: "",
    reps: "",
    additionalComments: "",
    workoutSuggestion: "",
  });

  const exercises = [
    {
      id: "1",
      name: "Incline Chest Press",
      category: "chest",
      reps: "10/10/10",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "2", 
      name: "Dumbbell Flyes",
      category: "chest",
      reps: "12/12/12",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "3",
      name: "Bicep Curls",
      category: "arm",
      reps: "15/15/15",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "4",
      name: "Tricep Dips",
      category: "arm", 
      reps: "8/8/8",
      setType: "Normal Set",
      image: "/exercise_image.png"
    }
  ];

  // Filter exercises based on selected category
  const filteredExercises = exercises.filter(exercise => 
    exercise.category === filterCategory
  );

  const handleEditExercise = (exerciseId: string) => {
    console.log(`Editing exercise: ${exerciseId}`);
  };

  const handleCreateExercise = () => {
    setShowCreateExerciseForm(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Auto-populate the muscle group field when category is selected
    setExerciseForm(prev => ({
      ...prev,
      muscleGroup: category.charAt(0).toUpperCase() + category.slice(1) // Capitalize first letter
    }));
  };

  const handleBackToExercises = () => {
    setShowCreateExerciseForm(false);
    setSelectedCategory("");
    setExerciseForm({
      workoutName: "",
      setType: "",
      video: null,
      muscleGroup: "",
      reps: "",
      additionalComments: "",
      workoutSuggestion: "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExerciseForm((prev) => ({ ...prev, video: e.target.files![0] }));
    }
  };

  const handleFormSubmit = () => {
    console.log("Creating exercise:", {
      ...exerciseForm,
      selectedCategory: selectedCategory
    });
    handleBackToExercises();
  };

  if (showCreateExerciseForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💪</span>
            <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
          </div>
          <button
            onClick={handleBackToExercises}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Exercises
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#171616] mb-6">
            Create New Exercise
          </h2>
          <p className="text-gray-600 mb-6">
            Select category in which you want to add exercise
          </p>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => handleCategorySelect("chest")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "chest"
                  ? "bg-[#EC1D13] text-white"
                  : "bg-white text-black border border-black hover:bg-gray-50"
              }`}
            >
              Chest
            </button>
            <button
              onClick={() => handleCategorySelect("arm")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "arm"
                  ? "bg-[#EC1D13] text-white"
                  : "bg-white text-black border border-black hover:bg-gray-50"
              }`}
            >
              Arm
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={exerciseForm.workoutName}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      workoutName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Dumbbell Incline Bench Press"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Set Type
                </label>
                <input
                  type="text"
                  value={exerciseForm.setType}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      setType: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Normal Set"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Video
                </label>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Choose File
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Muscle Group
                </label>
                <input
                  type="text"
                  value={exerciseForm.muscleGroup}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      muscleGroup: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Chest"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reps
                </label>
                <input
                  type="text"
                  value={exerciseForm.reps}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      reps: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., 10/10/10"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              value={exerciseForm.additionalComments}
              onChange={(e) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  additionalComments: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-vertical"
              placeholder="Add any additional comments or instructions..."
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Workout Suggestion (Optional)
            </label>
            <input
              type="text"
              value={exerciseForm.workoutSuggestion}
              onChange={(e) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  workoutSuggestion: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="e.g., Cardio 40min"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleBackToExercises}
              className="w-[320px] px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Add Alternative
            </button>
            <button
              onClick={handleFormSubmit}
              className="w-[320px] px-6 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkoutPlanHeader onBack={onBack} />

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#171616]">Excercises</h2>
          <button
            onClick={handleCreateExercise}
            className="flex items-center space-x-2 px-4 py-2 border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            <span className="text-black font-medium">Create Excercise</span>
          </button>
        </div>

        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setFilterCategory("chest")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === "chest"
                ? "bg-[#EC1D13] text-white"
                : "bg-white text-black border border-black hover:bg-gray-50"
            }`}
          >
            Chest
          </button>
          <button 
            onClick={() => setFilterCategory("arm")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === "arm"
                ? "bg-[#EC1D13] text-white"
                : "bg-white text-black border border-black hover:bg-gray-50"
            }`}
          >
            Arm
          </button>
        </div>

        <div className="space-y-8">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="border border-black rounded-lg p-4">
                <div className="flex gap-6 items-center">
                  <div>
                    <div className="relative bg-white border border-black rounded-lg overflow-hidden w-[320px]">
                      <div className="h-48 bg-gray-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <Image
                            src={exercise.image}
                            alt="Exercise Image"
                            width={320}
                            height={200}
                          />
                        </div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleEditExercise(exercise.id)}
                            className="w-8 h-8 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-50"
                          >
                            <svg
                              className="w-4 h-4 text-black"
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
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-semibold">
                            {exercise.name}
                          </h3>
                          <p className="text-sm">Reps {exercise.reps}</p>
                          <span className="bg-[#EC1D13] text-white px-3 py-1 rounded text-sm">
                            {exercise.setType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-64">
                    <h3 className="font-bold text-[#171616] mb-1">
                      Equipment Options
                    </h3>
                    <p className="text-gray-500">Not found</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No exercises found for {filterCategory} category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 