"use client";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { CategorySelectionStep } from "./steps/CategorySelectionStep";
import { DaySelectionStep } from "./steps/DaySelectionStep";
import { ExerciseSelectionStep } from "./steps/ExerciseSelectionStep";
import { WorkoutPlanTypes, WorkoutPlan } from "./types";
import { CategoriesView } from "./views/CategoriesView";
import { ExercisesView } from "./views/exercises/ExercisesView";
import { WorkoutPlanHeader } from "./WorkoutPlanHeader";
import WorkoutPlansList from "./WorkoutPlansList";
import WorkoutPlanEditForm from "./WorkoutPlanEditForm";

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
  const [creatingPlan, setCreatingPlan] = useState(false);

  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');

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

  // Load dummy workout plans on component mount
  useEffect(() => {
    const dummyPlans: WorkoutPlan[] = [
      {
        _id: "1",
        workoutPlanId: "muscle-mass",
        title: "Muscle Mass Gain Plan",
        type: "muscle-mass",
        createdAt: "2024-01-15T10:30:00Z",
        selectedDays: [1, 2, 3],
        dayCategories: {
          1: "chest",
          2: "back",
          3: "legs"
        },
        dayExercises: {
          1: ["1", "2"],
          2: ["3", "4"],
          3: ["5", "6"]
        }
      },
      {
        _id: "2",
        workoutPlanId: "weight-loss",
        title: "Weight Loss Plan",
        type: "weight-loss",
        createdAt: "2024-01-20T14:20:00Z",
        selectedDays: [1, 2, 3, 4],
        dayCategories: {
          1: "cardio",
          2: "strength",
          3: "cardio",
          4: "strength"
        },
        dayExercises: {
          1: ["7", "8"],
          2: ["9", "10"],
          3: ["11", "12"],
          4: ["13", "14"]
        }
      }
    ];
    setWorkoutPlans(dummyPlans);
  }, []);

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
    setCreatingPlan(true);
    try {
      const response = await fetchWrapper("/admin/workout-plan/save", {
        method: "POST",
        body: { workoutPlanId, selectedDays, dayCategories, dayExercises },
      });
      if (response.success) {
        toast.success("Workout plan created successfully");
        // Add the new plan to the list
        const newPlan: WorkoutPlan = {
          _id: Date.now().toString(),
          workoutPlanId,
          title: `Workout Plan for ${workoutPlanId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
          type: workoutPlanId,
          createdAt: new Date().toISOString(),
          selectedDays,
          dayCategories,
          dayExercises
        };
        setWorkoutPlans(prev => [...prev, newPlan]);
        setViewMode('list');
      } else {
        toast.error("Failed to create workout plan");
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
      // For now, just log the data instead of making backend request
      console.log("Workout plan data to save:", { workoutPlanId, selectedDays, dayCategories, dayExercises });
      
      // Add the new plan to the list anyway for demo purposes
      const newPlan: WorkoutPlan = {
        _id: Date.now().toString(),
        workoutPlanId,
        title: `Workout Plan for ${workoutPlanId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        type: workoutPlanId,
        createdAt: new Date().toISOString(),
        selectedDays,
        dayCategories,
        dayExercises
      };
      setWorkoutPlans(prev => [...prev, newPlan]);
      setViewMode('list');
      toast.success("Workout plan created successfully (demo mode)");
    } finally {
      setCreatingPlan(false);
      setShowMultiStepFlow(false);
      setCurrentStep("days");
      setSelectedDays([]);
      setDayCategories({});
      setDayExercises({});
    }
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setViewMode('edit');
  };

  const handleSaveEditedPlan = (updatedPlan: WorkoutPlan) => {
    console.log("Updated workout plan data:", updatedPlan);
    setWorkoutPlans(prev => 
      prev.map(plan => 
        plan._id === updatedPlan._id ? updatedPlan : plan
      )
    );
    setEditingPlan(null);
    setViewMode('list');
    toast.success("Workout plan updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setViewMode('list');
  };

  const handleCreateNew = () => {
    setViewMode('create');
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
              creatingPlan={creatingPlan}
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

  // Show edit form when editing
  if (viewMode === 'edit' && editingPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💪</span>
          <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
        </div>
        <WorkoutPlanEditForm
          workoutPlan={editingPlan}
          onSave={handleSaveEditedPlan}
          onCancel={handleCancelEdit}
          loading={false}
        />
        <Toaster />
      </div>
    );
  }

  // Show workout plans list
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💪</span>
          <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
        </div>
        
        <WorkoutPlansList
          workoutPlans={workoutPlans}
          onEditPlan={handleEditPlan}
          onCreateNew={handleCreateNew}
        />

        <Toaster />
      </div>
    );
  }

  // Show create options when creating new
  if (viewMode === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">💪</span>
          <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#171616]">
              Create New Workout Plan
            </h2>
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Plans
            </button>
          </div>

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
