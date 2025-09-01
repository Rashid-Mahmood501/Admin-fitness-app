"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useState, type JSX } from "react";
import toast, { Toaster } from "react-hot-toast";
import DeleteModal from "../DeleteModal";
import type { WorkoutPlan } from "./types";

interface WorkoutPlansListProps {
  workoutPlans: WorkoutPlan[];
  onEditPlan: (plan: WorkoutPlan) => void;
  onCreateNew: () => void;
  getAllWorkoutPlans: () => void;
}

export default function WorkoutPlansList({
  workoutPlans,
  onEditPlan,
  onCreateNew,
  getAllWorkoutPlans,
}: WorkoutPlansListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlanTypeTitle = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "muscle-mass": "Workout Plan for Muscle Mass",
      "weight-loss": "Workout Plan for Weight Loss",
      "bulk-up": "Workout Plan for Bulk Up",
    };
    return typeMap[type] || type;
  };

  const getPlanTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      "muscle-mass": "from-blue-500 to-blue-600",
      "weight-loss": "from-green-500 to-green-600",
      "bulk-up": "from-purple-500 to-purple-600",
    };
    return colorMap[type] || "from-gray-500 to-gray-600";
  };

  const getPlanTypeIcon = (type: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      "muscle-mass": (
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      "weight-loss": (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      "bulk-up": (
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
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m-3 0a1.5 1.5 0 013 0"
          />
        </svg>
      ),
    };
    return (
      iconMap[type] || (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      )
    );
  };

  const handleDelete = async (exerciseId: string) => {
    console.log("Delete exercise with ID:", exerciseId);
    try {
      toast.loading("Deleting exercise...", { id: "exercise-delete" });
      const result = await fetchWrapper(
        `/admin/workout-plan/delete/${exerciseId}`,
        {
          method: "DELETE",
        }
      );
      if (result.success) {
        toast.dismiss("exercise-delete");
        toast.success("Exercise deleted successfully!");
        getAllWorkoutPlans();
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.dismiss("exercise-delete");
      toast.error("Failed to delete exercise.");
    } finally {
      setDeleteModalOpen(false);
      setSelectedExercise("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2">
              Workout Plans
            </h2>
            <p className="text-slate-600">
              Manage and organize your training programs
            </p>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center space-x-2 group"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
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

        {workoutPlans.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="text-center py-16 px-8">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No workout plans yet
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Get started by creating your first workout plan. Design custom
                training programs tailored to your fitness goals.
              </p>
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium inline-flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Create Your First Plan</span>
              </button>
            </div>
          </div>
        ) : (
          /* Plans Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${getPlanTypeColor(
                    plan.planId
                  )} p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {getPlanTypeIcon(plan.planId)}
                      </div>
                      {/* <button
                        onClick={() => onEditPlan(plan)}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        <svg
                          className="w-5 h-5"
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
                      </button> */}
                      <button
                        onClick={() => {
                          setSelectedExercise(plan._id || "");
                          setDeleteModalOpen(true);
                        }}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <h3 className="text-xl font-bold mb-2 leading-tight">
                      {getPlanTypeTitle(plan.planId)}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      Plan ID: {plan.planId}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {plan.days.length}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Training Days
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        {plan.days.reduce(
                          (total, day) => total + (day.exercises?.length || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Total Exercises
                      </div>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center text-sm text-slate-600 mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Created:</span>
                    <span className="ml-1">{formatDate(plan.createdAt)}</span>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Daily Schedule
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {plan.days.map((day) => (
                        <div
                          key={day.dayNumber}
                          className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {day.dayNumber}
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              Day {day.dayNumber}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-slate-600 mr-2">
                              {day.exercises?.length || 0}
                            </span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onEditPlan(plan)}
                    className="w-full mt-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-4 rounded-xl hover:from-slate-900 hover:to-black transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <span>Edit Plan</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          description="Are you sure you want to delete this exercise?"
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDelete(selectedExercise)}
        />
      )}
      <Toaster />
    </div>
  );
}
