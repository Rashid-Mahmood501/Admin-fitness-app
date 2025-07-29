"use client";

import type React from "react";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { Category, Exercise, WorkoutPlan } from "./types";

interface WorkoutPlanEditFormProps {
  workoutPlan: WorkoutPlan;
  onSave: () => void;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(loading);

  const fetchExercises = async () => {
    try {
      setLoadingExercises(true);
      const response = await fetchWrapper("/admin/workout/all");
      setExercises(response.workouts);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    setFormData(workoutPlan);
  }, [workoutPlan]);

  // Handle input changes
  const handleInputChange = (field: keyof WorkoutPlan, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle category change
  const handleDayCategoryChange = (day: number, category: string) => {
    setFormData((prev) => {
      const updatedDays = prev.days.map((d) => {
        if (d.dayNumber === day) {
          // Remove exercises that don't belong to the new category
          const updatedExercises = d.exercises.filter(
            (ex) => ex.muscleGroup === category
          );
          return {
            ...d,
            category,
            exercises: updatedExercises,
          };
        }
        return d;
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetchWrapper("/admin/workout-category/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleExerciseToggle = (day: number, exerciseId: string) => {
    setFormData((prev: any) => {
      const updatedDays = prev.days.map((d: any) => {
        if (d.dayNumber === day) {
          const updatedExercises = d.exercises.some(
            (ex: any) => ex._id === exerciseId
          )
            ? d.exercises.filter((ex: any) => ex._id !== exerciseId)
            : [
                ...d.exercises,
                ...(exercises.find((ex) => ex._id === exerciseId)
                  ? [{ ...exercises.find((ex) => ex._id === exerciseId) }]
                  : []),
              ];
          return {
            ...d,
            exercises: updatedExercises,
          };
        }
        return d;
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transformedData = {
      ...formData,
      days: formData.days.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ex._id),
      })),
    };

    const body = {
      planId: formData.planId,
      days: transformedData.days,
    };

    try {
      const result = await fetchWrapper(
        `/admin/workout-plan/update/${formData._id}`,
        {
          method: "PUT",
          body,
        }
      );
      if (result.success) {
        toast.success("Workout plan updated successfully");
        onCancel();
        onSave();
      }
    } catch (error) {
      console.error("Error saving workout plan:", error);
      return;
    }
  };

  // Get plan title
  const getPlanTypeTitle = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "muscle-mass": "Workout Plan for Muscle Mass",
      "weight-loss": "Workout Plan for Weight Loss",
      "bulk-up": "Workout Plan for Bulk Up",
    };
    return typeMap[type] || type;
  };

  // Get plan type
  const getPlanTypeType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "muscle-mass": "Muscle Mass",
      "weight-loss": "Weight Loss",
      "bulk-up": "Bulk Up",
    };
    return typeMap[type] || type;
  };

  if (loadingExercises) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Edit Workout Plan
                </h2>
                <p className="text-blue-100">
                  Customize your training schedule
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Plan Details */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  Plan Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Plan Title
                    </label>
                    <input
                      type="text"
                      value={getPlanTypeTitle(formData.planId)}
                      onChange={(e) =>
                        handleInputChange("planId", e.target.value)
                      }
                      disabled
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Plan Type
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-slate-800 font-medium">
                      {getPlanTypeType(formData.planId)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Days and Categories */}
              <div>
                <div className="space-y-6">
                  {formData.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-800 text-lg flex items-center">
                            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                              {day.dayNumber}
                            </div>
                            Day {day.dayNumber}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                              {day.exercises.length} exercises
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                              Category
                            </label>
                            <select
                              value={day.category}
                              onChange={(e) =>
                                handleDayCategoryChange(
                                  day.dayNumber,
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:red-blue-500 focus:border-transparent text-slate-800 bg-white shadow-sm transition-all duration-200"
                            >
                              {categories?.map((category) => (
                                <option
                                  key={category._id}
                                  value={category.name}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected Exercises */}
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                              Selected Exercises
                            </label>
                            <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-xl bg-slate-50">
                              {day.exercises.length > 0 ? (
                                <div className="p-3 space-y-2">
                                  {day.exercises.map((exercise) => (
                                    <div
                                      key={exercise._id}
                                      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-200"
                                    >
                                      <span className="text-slate-800 font-medium text-sm">
                                        {exercise.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleExerciseToggle(
                                            day.dayNumber,
                                            exercise._id
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 text-center">
                                  <div className="text-slate-400 mb-2">
                                    <svg
                                      className="w-12 h-12 mx-auto"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                      />
                                    </svg>
                                  </div>
                                  <p className="text-slate-500 text-sm font-medium">
                                    No exercises selected
                                  </p>
                                  <p className="text-slate-400 text-xs mt-1">
                                    Choose from available exercises below
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Available Exercises */}
                        <div className="mt-6">
                          <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Available Exercises
                          </label>
                          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                              {exercises
                                .filter((ex) => ex.muscleGroup === day.category)
                                .map((exercise) => (
                                  <label
                                    key={exercise._id}
                                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors duration-200 border border-transparent hover:border-slate-200"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={day.exercises.some(
                                        (ex) => ex._id === exercise._id
                                      )}
                                      onChange={() =>
                                        handleExerciseToggle(
                                          day.dayNumber,
                                          exercise._id
                                        )
                                      }
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-slate-700">
                                      {exercise.name}
                                    </span>
                                  </label>
                                ))}
                            </div>
                            {exercises.filter(
                              (ex) => ex.muscleGroup === day.category
                            ).length === 0 && (
                              <div className="text-center py-8">
                                <div className="text-slate-400 mb-2">
                                  <svg
                                    className="w-8 h-8 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1}
                                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                </div>
                                <p className="text-slate-500 text-sm">
                                  No exercises available for this category
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-8 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
