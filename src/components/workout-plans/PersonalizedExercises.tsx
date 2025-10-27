"use client"

import { WorkoutPlan } from "@/app/admin/personalized-workout/page";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import PersonalizedEditForm from "./PersonalizedEditForm";

export default function PersonalizedExercises() {
    const [viewMode, setViewMode] = useState<"list" | "edit">("list");
    const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
    const [loading, setLoading] = useState(false)
    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString)
        return `Joined on ${date.toLocaleDateString("en-GB")} | ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })}`
    }

    const getActivityLevelDisplay = (level: string) => {
        if (!level) return "Not Set"
        switch (level.toLowerCase()) {
            case "very active":
                return "Very Active"
            case "moderately active":
                return "Moderately Active"
            case "lightly active":
                return "Lightly Active"
            default:
                return level
        }
    }

    const getGoalDisplay = (goal: string) => {
        if (!goal) return "Not Set"
        switch (goal.toLowerCase()) {
            case "build muscle mass":
                return "Build Muscle Mass"
            case "loss weight":
                return "Loss Weight"
            case "bulk up":
                return "Bulk Up"
            default:
                return goal
        }
    }

    const handleSaveEditedPlan = () => {
        getAllWorkoutPlans();
    };


    const getAllWorkoutPlans = async () => {
        try {
            setLoading(true)
            const response = await fetchWrapper("/admin/user-workout-plan/all")
            if (response.success) {
                setWorkoutPlans(response.plans)
            }
        } catch (error) {
            console.error("Failed to fetch workout plans:", error)
            // toast.error("Failed to fetch workout plans. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingPlan(null);
        setViewMode("list");
    };

    const onEditPlan = (plan: WorkoutPlan) => {
        setEditingPlan(plan);
        setViewMode("edit");
    }

    useEffect(() => {
        getAllWorkoutPlans()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Personalized Exercises</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="flex gap-2">
                                            <div className="h-6 w-8 bg-gray-200 rounded"></div>
                                            <div className="h-6 w-12 bg-gray-200 rounded"></div>
                                            <div className="h-6 w-12 bg-gray-200 rounded"></div>
                                            <div className="h-6 w-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (viewMode === "edit" && editingPlan) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">💪</span>
                    <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
                </div>
                <PersonalizedEditForm
                    workoutPlan={editingPlan}
                    onSave={handleSaveEditedPlan}
                    onCancel={handleCancelEdit}
                    loading={false}
                />
                <Toaster />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Personalized Exercises</h1>

                {viewMode === "list" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-sm">
                        {workoutPlans.map((plan) => (
                            <div
                                key={plan?._id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 hover:shadow-md transition-shadow duration-200 min-w-[350px]"
                            >
                                {/* User Info Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={plan?.userId?.profilePicture || "/placeholder.svg"}
                                        alt={plan?.userId?.fullname}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm">{plan?.userId?.fullname}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                                                {plan?.userId?.age}y
                                            </span>
                                            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-medium">
                                                {plan?.userId?.gender === "male" ? "Male" : "Female"}
                                            </span>
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                                                {plan?.userId?.weight}lb
                                            </span>
                                            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-medium">
                                                {(plan?.userId?.height / 30.48).toFixed(1)} ft
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Goal */}
                                <h4 className="font-semibold text-gray-900 text-lg mb-4">{getGoalDisplay(plan?.userId?.goal)}</h4>

                                {/* Workout Details */}
                                <div className="space-y-3 mb-4 border-t border-gray-400 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Workout days (as selected by the user)</span>
                                        <span className="text-sm font-semibold text-gray-900">Activity level</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">{plan?.userId?.workoutDays || 0} Days</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {getActivityLevelDisplay(plan?.userId?.activityLevel) || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                {/* Join Date */}
                                <p className="text-xs text-gray-500 mb-6">{formatJoinDate(plan?.userId?.createdAt)}</p>

                                {/* Action Button */}
                                <button className=" w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-500 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                                    onClick={() => onEditPlan(plan)}
                                >
                                    {/* <PencilIcon className="w-4 h-4" /> */}
                                    Make Exercise Plan
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {workoutPlans.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No workout plans found.</p>
                    </div>
                )}
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
    )
}
