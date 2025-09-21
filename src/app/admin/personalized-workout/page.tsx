"use client";
import PersonalizedExercises from "@/components/workout-plans/PersonalizedExercises";

export interface User {
    _id: string
    fullname: string
    email: string
    phoneNumber: string
    profilePicture: string
    profileComplete: boolean
    activityLevel: string
    age: number
    currentWeight: number
    gender: string
    goal: string
    height: number
    weight: number
    workoutDays: string
    createdAt: string
}

export interface Exercise {
    _id: string
    name: string
    muscleGroup: string
    setType: string
    reps: string
    comments: string
    video: string
    cardImage: string
    createdAt: string
    updatedAt: string
}

export interface WorkoutDay {
    dayNumber: number
    category: string
    exercises: Exercise[]
    _id: string
}

export interface WorkoutPlan {
    _id: string
    userId: User
    planId: string
    days: WorkoutDay[]
    createdAt: string
    updatedAt: string
}

export interface WorkoutPlansResponse {
    success: boolean
    plans: WorkoutPlan[]
}

export default function WorkoutPlansPage() {
    return <PersonalizedExercises />
}
