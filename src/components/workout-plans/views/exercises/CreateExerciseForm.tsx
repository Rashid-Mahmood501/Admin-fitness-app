"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Exercise, ExerciseForm } from "../../types";
import { CategorySelector } from "./CategorySelector";
import { FormField } from "./FormField";

interface CreateExerciseFormProps {
  isEditMode: boolean;
  editingExercise?: Exercise;
  onSubmit: (formData: ExerciseForm & { selectedCategory: string }) => void;
  onBack: () => void;
  loading: boolean;
}

export function CreateExerciseForm({
  isEditMode,
  editingExercise,
  onSubmit,
  onBack,
  loading,
}: CreateExerciseFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
    workoutName: "",
    setType: "",
    video: null,
    muscleGroup: "",
    reps: "",
    additionalComments: "",
    workoutSuggestion: "",
  });

  useEffect(() => {
    if (isEditMode && editingExercise) {
      setSelectedCategory(editingExercise.muscleGroup!);
      setExerciseForm({
        workoutName: editingExercise.name,
        setType: editingExercise.setType,
        video: null,
        muscleGroup: editingExercise.muscleGroup || "",
        reps: editingExercise.reps,
        additionalComments: editingExercise.comments || "",
        workoutSuggestion: editingExercise.suggestion || "",
      });
    }
  }, [isEditMode, editingExercise]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setExerciseForm((prev) => ({
      ...prev,
      muscleGroup: category.charAt(0).toUpperCase() + category.slice(1),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExerciseForm((prev) => ({ ...prev, video: e.target.files![0] }));
    }
  };

  const handleFormSubmit = () => {
    onSubmit({
      ...exerciseForm,
      selectedCategory,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💪</span>
          <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Back to Exercises
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-[#171616] mb-6">
          {isEditMode ? "Edit Exercise" : "Create New Exercise"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isEditMode
            ? "Update the exercise details below"
            : "Select category in which you want to add exercise"}
        </p>

        <CategorySelector
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <FormField
              label="Workout Name"
              value={exerciseForm.workoutName}
              onChange={(value) =>
                setExerciseForm((prev) => ({ ...prev, workoutName: value }))
              }
              placeholder="e.g., Dumbbell Incline Bench Press"
            />

            <FormField
              label="Set Type"
              value={exerciseForm.setType}
              onChange={(value) =>
                setExerciseForm((prev) => ({ ...prev, setType: value }))
              }
              placeholder="e.g., Normal Set"
            />

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
            <FormField
              label="Muscle Group"
              value={exerciseForm.muscleGroup}
              onChange={(value) =>
                setExerciseForm((prev) => ({ ...prev, muscleGroup: value }))
              }
              placeholder="e.g., Chest"
            />

            <FormField
              label="Reps"
              value={exerciseForm.reps}
              onChange={(value) =>
                setExerciseForm((prev) => ({ ...prev, reps: value }))
              }
              placeholder="e.g., 10/10/10"
            />
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
            onClick={onBack}
            className="w-[320px] px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            {isEditMode ? "Cancel" : "Add Alternative"}
          </button>
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="w-[320px] px-6 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Create")}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
