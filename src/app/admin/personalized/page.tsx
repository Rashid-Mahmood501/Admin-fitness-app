"use client";
import MealPlanList from "@/components/meal-plans/MealPlanList";
import UserMealPlanEditForm from "@/components/meal-plans/UserMealPlanEditForm";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";

export interface MealOption {
  id: string;
  foodName: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  preparation: string;
  image: string;
}

export interface DayMeal {
  day: number;
  mealOptions: MealOption[];
  isCompleted: boolean;
}

export interface UserInfo {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture: string;
  profileComplete: boolean;
  mealGenerated: boolean;
  createdAt: string;
  __v: number;
  activityLevel: string;
  age: number;
  currentWeight: number;
  gender: "male" | "female" | string;
  goal: string;
  height: number;
  mealType: string;
  weight: number;
  workoutDays: string;
}

export interface MealPlan {
  _id: string;
  id: string;
  userId: UserInfo;
  title: string;
  type: "bulk-up" | "weight-loss" | "muscle-mass";
  days: DayMeal[];
}

export default function PersonalizedMealPlansPage() {
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const [editingMealPlan, setEditingMealPlan] = useState<MealPlan>();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllUserMealPlans = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper("/admin/meal/all-user-meal-plans");
      if (response.success) {
        setMealPlans(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch meal plans:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUserMealPlans();
  }, []);
  const handleEditPlan = (mealPlan: MealPlan) => {
    setEditingMealPlan(mealPlan);
    setViewMode("edit");
  };

  const handleSaveEditedMealPlan = () => {
    setViewMode("list");
    setEditingMealPlan({} as MealPlan);
    getAllUserMealPlans();
  };

  const handleCancelEdit = () => {
    setViewMode("list");
    setEditingMealPlan({} as MealPlan);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🍽️</span>
        <h1 className="text-3xl font-bold text-[#171616]">
          Personalized Meal Plans
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        {viewMode === "edit" ? (
          <UserMealPlanEditForm
            mealPlan={editingMealPlan!}
            onSave={handleSaveEditedMealPlan}
            onCancel={handleCancelEdit}
          />
        ) : (
          <MealPlanList onEditPlan={handleEditPlan} mealPlans={mealPlans} />
        )}
      </div>
    </div>
  );
}
