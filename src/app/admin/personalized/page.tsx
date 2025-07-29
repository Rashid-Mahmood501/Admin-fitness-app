"use client";
import MealPlanList from "@/components/meal-plans/MealPlanList";

export default function PersonalizedMealPlansPage() {
  const handleEditPlan = (userId: string) => {
    // Handle edit plan functionality
    console.log("Edit plan for user:", userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🍽️</span>
        <h1 className="text-3xl font-bold text-[#171616]">Personalized Meal Plans</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <MealPlanList onEditPlan={handleEditPlan} />
      </div>
    </div>
  );
} 