"use client";

import Image from "next/image";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function WorkoutPlansPage() {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Chest" },
    { id: "2", name: "Arm" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "create">("create");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [showCreateExerciseForm, setShowCreateExerciseForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [exerciseForm, setExerciseForm] = useState({
    workoutName: "",
    setType: "",
    video: null as File | null,
    muscleGroup: "",
    reps: "",
    additionalComments: "",
    workoutSuggestion: "",
  });

  // New state for multi-step flow
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

  const workoutPlanTypes = [
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
      setShowMultiStepFlow(true);
      setShowCreateExerciseForm(true);
    } else {
      console.log(`Selected workout plan: ${planId}`);
    }
  };

  const handleBackToMain = () => {
    setSelectedView(null);
  };

  const handleEditCategory = (category: Category) => {
    setModalType("edit");
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleCreateCategory = () => {
    setModalType("create");
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) return;

    if (modalType === "create") {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryName.trim(),
      };
      setCategories([newCategory, ...categories]); // Add to top
    } else if (modalType === "edit" && editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, name: categoryName.trim() }
            : cat
        )
      );
    }

    setShowModal(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleCreateExercise = () => {
    setShowCreateExerciseForm(true);
  };

  const handleDaySelection = (day: number) => {
    // This should select the number of days, not individual days
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

  const handleContinueToExercises = () => {
    // This is now the final "Create" button that logs all data
    console.log("Creating workout plan with all data:", {
      selectedDays: selectedDays[0],
      dayCategories,
      dayExercises,
    });
    
    // Reset and go back to main
    setShowCreateExerciseForm(false);
    setShowMultiStepFlow(false);
    setCurrentStep("days");
    setSelectedDays([]);
    setDayCategories({});
    setDayExercises({});
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
    // This will be called when user confirms exercises for current day
    setCurrentStep("categories");
    
    // Auto-advance to next day if there are more days
    const nextDay = currentDay + 1;
    if (nextDay <= selectedDays[0]) {
      setCurrentDay(nextDay);
    }
  };





  const handleBackToExercises = () => {
    setShowCreateExerciseForm(false);
    setShowMultiStepFlow(false);
    setSelectedCategory("");
    setExerciseForm({
      workoutName: "",
      setType: "",
      video: null,
      muscleGroup: "",
      reps: "",
      additionalComments: "",
      workoutSuggestion: "",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExerciseForm((prev) => ({ ...prev, video: e.target.files![0] }));
    }
  };

  const handleFormSubmit = () => {
    console.log("Creating exercise:", exerciseForm);
    // Here you would typically send the data to your API
    handleBackToExercises();
  };

  const handleEditExercise = (exerciseId: string) => {
    console.log(`Editing exercise: ${exerciseId}`);
  };

  if (showMultiStepFlow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💪</span>
            <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
          </div>
          <button
            onClick={handleBackToExercises}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Workout Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {currentStep === "days" && (
            <>
              <h2 className="text-2xl font-bold text-[#171616] mb-6">
                Create Exercise Plan
              </h2>
              <p className="text-gray-600 mb-8">
                Select the days split you want to create for
              </p>

              <div className="flex space-x-4 mb-8">
                {[3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDaySelection(day)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? "bg-[#EC1D13] text-white"
                        : "bg-white text-black border border-black hover:bg-gray-50"
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>

              <div>
                <button
                  onClick={handleContinueToCategories}
                  disabled={selectedDays.length === 0}
                  className="px-32 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </>
          )}

          {currentStep === "categories" && (
            <>
              <h2 className="text-2xl font-bold text-[#171616] mb-6">
                Create Exercise Plan
              </h2>

                              {/* Day Tabs */}
                <div className="flex space-x-4 mb-8">
                  {Array.from(
                    { length: selectedDays[0] },
                    (_, index) => index + 1
                  ).map((day) => (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        currentDay === day
                          ? "bg-[#EC1D13] text-white"
                          : dayExercises[day] && dayExercises[day].length > 0
                          ? "bg-gray-600 text-white"
                          : dayCategories[day]
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black border border-black hover:bg-gray-50"
                      }`}
                    >
                      Day {day}
                    </button>
                  ))}
                </div>

              {/* Content for Current Day */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#171616] mb-4">
                  Day {currentDay}
                </h3>
                <p className="text-gray-600 mb-4">
                  Select the category in which you want to add exercises for
                  users
                </p>

                {/* Category Selection */}
                <div className="flex space-x-4 mb-6">
                  {["Chest", "Arm", "Abs"].map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        handleCategorySelection(currentDay, category)
                      }
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        dayCategories[currentDay] === category
                          ? "bg-[#EC1D13] text-white"
                          : "bg-white text-black border border-black hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                                 <div className="mt-8">
                   <div
                     onClick={() => setCurrentStep("exercises")}
                     className="bg-white rounded-lg border border-black p-6 cursor-pointer hover:shadow-lg transition-all duration-200 w-64"
                   >
                     <div className="flex justify-center mb-4">
                       <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                         <span className="text-3xl font-bold text-white">+</span>
                       </div>
                     </div>
                     <h3 className="text-base font-medium text-[#171616] text-center">
                       Select Exercise
                     </h3>
                   </div>
                 </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleContinueToExercises}
                  disabled={
                    Object.keys(dayCategories).length !== selectedDays[0] ||
                    Object.keys(dayExercises).length !== selectedDays[0]
                  }
                  className="px-8 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </>
          )}

          {currentStep === "exercises" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#171616]">
                  Select Exercises
                </h2>
                <div>
                  <button
                    onClick={handleConfirmExercisesForDay}
                    className="px-8 py-1.5 bg-[#EC1D13] text-white rounded-lg text-sm font-semibold hover:bg-[#d41910] transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="border border-black rounded-lg p-6">

                  <div className="flex gap-6">
<div className="flex-1 flex items-center gap-6">
<div>
                      <div className="relative bg-white border border-black rounded-lg overflow-hidden w-[320px]">
                        <div className="h-48 bg-gray-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <Image
                              src="/exercise_image.png"
                              alt="Exercise Image"
                              width={320}
                              height={200}
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <button className="w-8 h-8 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-50">
                              <svg
                                className="w-4 h-4 text-black"
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
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-lg font-semibold">
                              Incline Chest Press
                            </h3>
                            <p className="text-sm">Reps 10/10/10</p>
                            <span className="bg-[#EC1D13] text-white px-3 py-1 rounded text-sm">
                              Normal Set
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-64">
                      <h3 className="font-bold text-[#171616] mb-2">
                        Equipment Options
                      </h3>
                      <p className="text-gray-500">Not found</p>
                    </div>
</div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={
                          dayExercises[currentDay]?.includes("exercise-1") || false
                        }
                        onChange={() =>
                          handleExerciseSelection(currentDay, "exercise-1")
                        }
                        className="w-5 h-5 text-[#EC1D13] border-gray-300 focus:ring-[#EC1D13] accent-[#EC1D13]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}


        </div>
      </div>
    );
  }

  if (showCreateExerciseForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💪</span>
            <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
          </div>
          <button
            onClick={handleBackToExercises}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Exercises
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#171616] mb-6">
            Create New Exercise
          </h2>
          <p className="text-gray-600 mb-6">
            Select category in which you want to add exercise
          </p>

          {/* Category Selection */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setSelectedCategory("chest")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "chest"
                  ? "bg-[#EC1D13] text-white"
                  : "bg-white text-black border border-black hover:bg-gray-50"
              }`}
            >
              Chest
            </button>
            <button
              onClick={() => setSelectedCategory("arm")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "arm"
                  ? "bg-[#EC1D13] text-white"
                  : "bg-white text-black border border-black hover:bg-gray-50"
              }`}
            >
              Arm
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={exerciseForm.workoutName}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      workoutName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Dumbbell Incline Bench Press"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Set Type
                </label>
                <input
                  type="text"
                  value={exerciseForm.setType}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      setType: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Normal Set"
                />
              </div>

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

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Muscle Group
                </label>
                <input
                  type="text"
                  value={exerciseForm.muscleGroup}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      muscleGroup: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., Chest"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reps
                </label>
                <input
                  type="text"
                  value={exerciseForm.reps}
                  onChange={(e) =>
                    setExerciseForm((prev) => ({
                      ...prev,
                      reps: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="e.g., 10/10/10"
                />
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              value={exerciseForm.additionalComments}
              onChange={(e) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  additionalComments: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-vertical"
              placeholder="Add any additional comments or instructions..."
            />
          </div>

          {/* Workout Suggestion (Optional) */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Workout Suggestion (Optional)
            </label>
            <input
              type="text"
              value={exerciseForm.workoutSuggestion}
              onChange={(e) =>
                setExerciseForm((prev) => ({
                  ...prev,
                  workoutSuggestion: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="e.g., Cardio 40min"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBackToExercises}
              className="w-[320px] px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Add Alternative
            </button>
            <button
              onClick={handleFormSubmit}
              className="w-[320px] px-6 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedView === "exercises") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💪</span>
            <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
          </div>
          <button
            onClick={handleBackToMain}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Workout Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#171616]">Excercises</h2>
            <button
              onClick={handleCreateExercise}
              className="flex items-center space-x-2 px-4 py-2 border border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
              <span className="text-black font-medium">Create Excercise</span>
            </button>
          </div>

          <div className="flex space-x-4 mb-8">
            <button className="px-6 py-2 bg-[#EC1D13] text-white rounded-lg font-medium">
              Chest
            </button>
            <button className="px-6 py-2 bg-white text-black border border-black rounded-lg font-medium hover:bg-gray-50">
              Arm
            </button>
          </div>

          <div className="space-y-8">
            <div className="border border-black rounded-lg p-6">
              <div className="flex gap-6 items-center">
                <div>
                  <div className="relative bg-white border border-black rounded-lg overflow-hidden w-[320px]">
                    <div className="h-48 bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <Image
                          src="/exercise_image.png"
                          alt="Exercise Image"
                          width={320}
                          height={200}
                        />
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleEditExercise("1")}
                          className="w-8 h-8 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-50"
                        >
                          <svg
                            className="w-4 h-4 text-black"
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
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-semibold">
                          Incline Chest Press
                        </h3>
                        <p className="text-sm">Reps 10/10/10</p>
                        <span className="bg-[#EC1D13] text-white px-3 py-1 rounded text-sm">
                          Normal Set
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-64">
                  <h3 className="font-bold text-[#171616] mb-2">
                    Equipment Options
                  </h3>
                  <p className="text-gray-500">Not found</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedView === "categories") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💪</span>
            <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
          </div>
          <button
            onClick={handleBackToMain}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Workout Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#171616] mb-6">Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-black p-6 relative"
              >
                <button
                  onClick={() => handleEditCategory(category)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-black"
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
                </button>
                <h3 className="text-base font-medium text-[#171616] text-center">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div
              onClick={handleCreateCategory}
              className="bg-white rounded-lg border border-black p-6 cursor-pointer hover:shadow-lg transition-all duration-200 w-64"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">+</span>
                </div>
              </div>
              <h3 className="text-base font-medium text-[#171616] text-center">
                Create New Category
              </h3>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
              <h3 className="text-2xl font-bold text-[#171616] mb-6">
                {modalType === "create"
                  ? "Create New Category"
                  : "Edit Category"}
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!categoryName.trim()}
                  className="flex-1 bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalType === "create" ? "Create" : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
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
