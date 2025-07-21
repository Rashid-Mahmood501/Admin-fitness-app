"use client";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { CategorySelectionStep } from "./steps/CategorySelectionStep";
import { DaySelectionStep } from "./steps/DaySelectionStep";
import { ExerciseSelectionStep } from "./steps/ExerciseSelectionStep";
import { WorkoutPlanTypes } from "./types";
import { CategoriesView } from "./views/CategoriesView";
import { ExercisesView } from "./views/exercises/ExercisesView";
import { WorkoutPlanHeader } from "./WorkoutPlanHeader";

export default function WorkoutPlansPage() {
  const [currentStep, setCurrentStep] = useState<
    "days" | "categories" | "exercises"
  >("days");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [dayCategories, setDayCategories] = useState<{ [key: number]: string }>(
    {}
  );
  const [dayExercises, setDayExercises] = useState<{ [key: number]: string[] }>(
    {}
  );
  const [showMultiStepFlow, setShowMultiStepFlow] = useState(false);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [workoutPlanId, setWorkoutPlanId] = useState<string>("");

  const [selectedView, setSelectedView] = useState<string | null>(null);

  const workoutPlanTypes: WorkoutPlanTypes[] = [
    {
      id: "muscle-mass",
      title: "Create exercise plan for muscle mass",
    },
    {
      id: "weight-loss",
      title: "Create exercise plan for Loss weight",
    },
    {
      id: "bulk-up",
      title: "Create exercise plan for Bulk Up",
    },
    {
      id: "categories",
      title: "Categories",
    },
    {
      id: "exercises",
      title: "Excercises",
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === "categories") {
      setSelectedView("categories");
    } else if (planId === "exercises") {
      setSelectedView("exercises");
    } else if (["muscle-mass", "weight-loss", "bulk-up"].includes(planId)) {
      setCurrentStep("days");
      setWorkoutPlanId(planId);
      setShowMultiStepFlow(true);
    } else {
      console.log(`Selected workout plan: ${planId}`);
    }
  };

  const handleBackToMain = () => {
    setSelectedView(null);
    setShowMultiStepFlow(false);
  };

  const handleDaySelection = (day: number) => {
    setSelectedDays([day]);
  };

  const handleContinueToCategories = () => {
    if (selectedDays.length > 0) {
      setCurrentStep("categories");
    }
  };

  const handleCategorySelection = (day: number, category: string) => {
    setDayCategories((prev) => ({ ...prev, [day]: category }));
  };

  const handleExerciseSelection = (day: number, exerciseId: string) => {
    setDayExercises((prev) => ({
      ...prev,
      [day]: prev[day]?.includes(exerciseId)
        ? prev[day].filter((id) => id !== exerciseId)
        : [...(prev[day] || []), exerciseId],
    }));
  };

  const handleConfirmExercisesForDay = () => {
    setCurrentStep("categories");

    const nextDay = currentDay + 1;
    if (nextDay <= selectedDays[0]) {
      setCurrentDay(nextDay);
    }
  };

  const handleCreateWorkoutPlan = async () => {
    try {
      const response = await fetchWrapper("/admin/workout-plan/save", {
        method: "POST",
        body: { workoutPlanId, selectedDays, dayCategories, dayExercises },
      });
      if (response.success) {
        toast.success("Workout plan created successfully");
      } else {
        toast.error("Failed to create workout plan");
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
    }

    setShowMultiStepFlow(false);
    setCurrentStep("days");
    setSelectedDays([]);
    setDayCategories({});
    setDayExercises({});
  };

  if (selectedView === "categories") {
    return <CategoriesView onBack={handleBackToMain} />;
  }

  if (selectedView === "exercises") {
    return <ExercisesView onBack={handleBackToMain} />;
  }

  if (showMultiStepFlow) {
    return (
      <div className="space-y-6">
        <WorkoutPlanHeader onBack={handleBackToMain} />

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {currentStep === "days" && (
            <DaySelectionStep
              selectedDays={selectedDays}
              onDaySelection={handleDaySelection}
              onContinue={handleContinueToCategories}
            />
          )}

          {currentStep === "categories" && (
            <CategorySelectionStep
              selectedDays={selectedDays}
              currentDay={currentDay}
              dayCategories={dayCategories}
              dayExercises={dayExercises}
              onDayChange={setCurrentDay}
              onCategorySelection={handleCategorySelection}
              onExerciseSelection={() => setCurrentStep("exercises")}
              onCreatePlan={handleCreateWorkoutPlan}
            />
          )}

          {currentStep === "exercises" && (
            <ExerciseSelectionStep
              currentDay={currentDay}
              selectedCategory={dayCategories[currentDay]}
              selectedExercises={dayExercises[currentDay] || []}
              onExerciseSelection={handleExerciseSelection}
              onConfirm={handleConfirmExercisesForDay}
              onBack={() => setCurrentStep("categories")}
            />
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">💪</span>
        <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {workoutPlanTypes.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className="bg-white rounded-lg border border-black p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-base font-medium text-[#171616] text-center">
                {plan.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mb-8"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workoutPlanTypes.slice(3, 5).map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className="bg-white rounded-lg border border-black p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-base font-medium text-[#171616] text-center">
                {plan.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
