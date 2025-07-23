"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import toast from "react-hot-toast";
import { ExerciseForm } from "../../types";
import { CategorySelector } from "./CategorySelector";
import { FormField } from "./FormField";

interface AlternativeExerciseProps {
  alternative: ExerciseForm;
  index: number;
  onChange: (index: number, updated: ExerciseForm) => void;
  onDelete: (index: number) => void;
}

export function AlternativeExercise({
  alternative,
  index,
  onChange,
  onDelete,
}: AlternativeExerciseProps) {
  const handleCategorySelect = (category: string) => {
    onChange(index, {
      ...alternative,
      muscleGroup: category.charAt(0).toUpperCase() + category.slice(1),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    toast.loading("Uploading video...", {
      id: "uploading-video",
    });
    try {
      const response = await fetchWrapper("/admin/workout/upload-video", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      if (response.videoUrl) {
        onChange(index, { ...alternative, video: response.videoUrl });
        toast.dismiss("uploading-video");
        toast.success("Video uploaded!");
      } else {
        toast.error("Video upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    }
  };

  return (
    <div className="space-y-6 mb-3">
      <div className="bg-white  p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#171616] mb-6">
            Add Alternative Exercise
          </h2>
          <button
            onClick={() => onDelete(index)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Delete Alternative
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Select category in which you want to add exercise
        </p>

        <CategorySelector
          selectedCategory={alternative.muscleGroup}
          onCategorySelect={handleCategorySelect}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <FormField
              label="Workout Name"
              value={alternative.workoutName}
              onChange={(value) =>
                onChange(index, { ...alternative, workoutName: value })
              }
              placeholder="e.g., Dumbbell Incline Bench Press"
            />

            <FormField
              label="Set Type"
              value={alternative.setType}
              onChange={(value) =>
                onChange(index, { ...alternative, setType: value })
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
              value={alternative.muscleGroup}
              onChange={(value) =>
                onChange(index, { ...alternative, muscleGroup: value })
              }
              placeholder="e.g., Chest"
            />

            <FormField
              label="Reps"
              value={alternative.reps}
              onChange={(value) =>
                onChange(index, { ...alternative, reps: value })
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
            value={alternative.additionalComments}
            onChange={(e) =>
              onChange(index, {
                ...alternative,
                additionalComments: e.target.value,
              })
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
            value={alternative.workoutSuggestion}
            onChange={(e) =>
              onChange(index, {
                ...alternative,
                workoutSuggestion: e.target.value,
              })
            }
            className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
            placeholder="e.g., Cardio 40min"
          />
        </div>
      </div>
    </div>
  );
}
