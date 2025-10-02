"use client"

import type React from "react"

import type { WorkoutPlan } from "@/app/admin/personalized-workout/page"
import { fetchWrapper } from "@/utils/fetchwraper"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import type { Category, Exercise } from "./types"

interface WorkoutPlanEditFormProps {
    workoutPlan: WorkoutPlan
    onSave: () => void
    onCancel: () => void
    loading?: boolean
}

export default function PersonalizedEditForm({
    workoutPlan,
    onSave,
    onCancel,
    loading = false,
}: WorkoutPlanEditFormProps) {
    const [formData, setFormData] = useState<WorkoutPlan>(workoutPlan)
    const [categories, setCategories] = useState<Category[]>([])
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loadingExercises, setLoadingExercises] = useState(loading)
    const [activeDay, setActiveDay] = useState<number>(1)

    const fetchExercises = async () => {
        try {
            setLoadingExercises(true)
            const response = await fetchWrapper("/admin/workout/all")
            setExercises(response.workouts)
        } catch (error) {
            console.error("Error fetching exercises:", error)
        } finally {
            setLoadingExercises(false)
        }
    }

    useEffect(() => {
        fetchExercises()
    }, [])

    useEffect(() => {
        setFormData(workoutPlan)
    }, [workoutPlan])

    // Handle category change
    const handleDayCategoryChange = (day: number, category: string) => {
        setFormData((prev) => {
            const updatedDays = prev.days.map((d) => {
                if (d.dayNumber === day) {
                    return {
                        ...d,
                        category,
                    }
                }
                return d
            })
            return {
                ...prev,
                days: updatedDays,
            }
        })
    }

    // Handle delete day
    const handleDeleteDay = (dayToDelete: number) => {
        if (formData.days.length <= 1) {
            toast.error("Cannot delete the last remaining day")
            return
        }

        setFormData((prev) => {
            const updatedDays = prev.days
                .filter((d) => d.dayNumber !== dayToDelete)
                .map((d, index) => ({
                    ...d,
                    dayNumber: index + 1, // Renumber days sequentially
                }))

            return {
                ...prev,
                days: updatedDays,
            }
        })

        // Adjust active day if necessary
        if (activeDay === dayToDelete) {
            setActiveDay(1) // Switch to day 1 if deleting current active day
        } else if (activeDay > dayToDelete) {
            setActiveDay(activeDay - 1) // Adjust active day number after deletion
        }

        toast.success(`Day ${dayToDelete} deleted successfully`)
    }

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetchWrapper("/admin/workout-category/all")
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }

    const handleExerciseToggle = (day: number, exerciseId: string) => {
        setFormData((prev: any) => {
            const updatedDays = prev.days.map((d: any) => {
                if (d.dayNumber === day) {
                    const updatedExercises = d.exercises.some((ex: any) => ex._id === exerciseId)
                        ? d.exercises.filter((ex: any) => ex._id !== exerciseId)
                        : [
                            ...d.exercises,
                            ...(exercises.find((ex) => ex._id === exerciseId)
                                ? [{ ...exercises.find((ex) => ex._id === exerciseId) }]
                                : []),
                        ]
                    return {
                        ...d,
                        exercises: updatedExercises,
                    }
                }
                return d
            })
            return {
                ...prev,
                days: updatedDays,
            }
        })
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const transformedData = {
            ...formData,
            days: formData.days.map((day) => ({
                ...day,
                exercises: day.exercises.map((ex) => ex._id),
            })),
        }

        const body = {
            planId: formData.planId,
            days: transformedData.days,
        }

        try {
            const result = await fetchWrapper(`/admin/user-workout-plan/update/${formData._id}`, {
                method: "PUT",
                body,
            })
            if (result.success) {
                toast.success("Workout plan updated successfully")
                onCancel()
                onSave()
            }
        } catch (error) {
            console.error("Error saving workout plan:", error)
            return
        }
    }

    const handleAddDay = () => {
        setFormData((prev: any) => {
            const newDayNumber = prev.days.length + 1
            const newDay = {
                dayNumber: newDayNumber,
                category: "",
                exercises: [],
            }
            return {
                ...prev,
                days: [...prev.days, newDay],
            }
        })
        setActiveDay(formData.days.length + 1) 
        toast.success(`Day ${formData.days.length + 1} added successfully`)
    }


    const currentDay = formData.days.find((day) => day.dayNumber === activeDay)

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
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-white px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Making Exercise Plan</h2>
                            </div>
                            <button
                                onClick={onCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex space-x-2 mb-8">
                                {formData.days.map((day) => (
                                    <button
                                        key={day.dayNumber}
                                        type="button"
                                        onClick={() => setActiveDay(day.dayNumber)}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeDay === day.dayNumber
                                            ? "bg-red-500 text-white shadow-md"
                                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        Day {day.dayNumber}
                                    </button>
                                ))}
                            </div>

                            {currentDay && (
                                <div className="space-y-6">
                                    {/* Category Selection */}
                                    <div>
                                        <p className="text-gray-700 mb-4 font-medium">Select the category and load exercises and add</p>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {categories?.map((category) => (
                                                <button
                                                    key={category._id}
                                                    type="button"
                                                    onClick={() => handleDayCategoryChange(activeDay, category.name)}
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${currentDay.category === category.name
                                                        ? "bg-red-500 text-white"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span>{category.name}</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Exercise Selection */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {exercises
                                            .filter((ex) => ex.muscleGroup === currentDay.category)
                                            .map((exercise) => (
                                                <label
                                                    key={exercise._id}
                                                    className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={currentDay.exercises.some((ex) => ex._id === exercise._id)}
                                                            onChange={() => handleExerciseToggle(activeDay, exercise._id)}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${currentDay.exercises.some((ex) => ex._id === exercise._id)
                                                                ? "bg-red-500 border-red-500"
                                                                : "border-gray-300 bg-white"
                                                                }`}
                                                        >
                                                            {currentDay.exercises.some((ex) => ex._id === exercise._id) && (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{exercise.name}</span>
                                                </label>
                                            ))}
                                    </div>

                                    {exercises.filter((ex) => ex.muscleGroup === currentDay.category).length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 mb-2">
                                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-lg font-medium">No exercises available for this category</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-8">
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleAddDay}
                                        className="px-6 py-3 bg-green-100 text-green-700 border border-green-300 rounded-lg hover:bg-green-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Day</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (activeDay < formData.days.length) {
                                                setActiveDay(activeDay + 1)
                                            }
                                        }}
                                        disabled={activeDay >= formData.days.length}
                                        className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
                                    >
                                        Next Day
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteDay(activeDay)}
                                        disabled={formData.days.length <= 1}
                                        className="px-6 py-3 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center space-x-2"
                                        title={formData.days.length <= 1 ? "Cannot delete the last remaining day" : `Delete Day ${activeDay}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Delete Day</span>
                                    </button>
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
    )
}