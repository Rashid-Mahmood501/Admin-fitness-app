"use client";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface MealOption {
  id: string;
  foodName: string;
  mealType: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image: string; // Now stores the image URL
  preparation: string;
}

interface DayData {
  day: number;
  mealOptions: MealOption[];
  isCompleted: boolean;
}

export default function MealPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [daysData, setDaysData] = useState<DayData[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      mealOptions: [],
      isCompleted: false,
    }))
  );
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<MealOption>();

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    toast.loading("Uploading image...", {
      id: "uploading-image",
    });

    try {
      const response = await fetchWrapper("/admin/meal/upload-image", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      if (response.imageUrl) {
        setValue("image", response.imageUrl);
        toast.dismiss("uploading-image");
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch {
      toast.error("Image upload error");
    }
  };

  const mealPlanTypes = [
    {
      id: "muscle-mass",
      title: "Create meal plan for muscle mass",
    },
    {
      id: "weight-loss",
      title: "Create meal plan for Loss weight",
    },
    {
      id: "bulk-up",
      title: "Create meal plan for Bulk Up",
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBackToCards = () => {
    setSelectedPlan(null);
    setSelectedDay(1);
    setDaysData(
      Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        mealOptions: [],
        isCompleted: false,
      }))
    );
    reset();
  };

  const onSubmit = (data: MealOption) => {
    const newMealOption: MealOption = {
      ...data,
      id: Date.now().toString(),
      image: data.image,
    };

    setDaysData((prev) =>
      prev.map((day) =>
        day.day === selectedDay
          ? { ...day, mealOptions: [...day.mealOptions, newMealOption] }
          : day
      )
    );
    reset();
  };

  const getCurrentDayData = () => {
    return daysData.find((day) => day.day === selectedDay) || daysData[0];
  };

  const getPlanTitle = (planId: string) => {
    const plan = mealPlanTypes.find((p) => p.id === planId);
    if (!plan) return "";

    const planType = plan.title.replace("Create meal plan for ", "");
    const capitalizedPlanType = planType
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `Create Meal Plan For ${capitalizedPlanType}`;
  };

  const shouldShowSaveNext = () => {
    const currentDayData = getCurrentDayData();
    return currentDayData.mealOptions.length >= 2;
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Add the current form's meal option if filled
    const formDataToSave = watch();
    let updatedDaysData = daysData;
    if (formDataToSave.foodName && formDataToSave.mealType) {
      const newMealOption: MealOption = {
        ...formDataToSave,
        id: Date.now().toString(),
        image: formDataToSave.image,
      };
      updatedDaysData = daysData.map((day) =>
        day.day === selectedDay
          ? {
              ...day,
              mealOptions: [...day.mealOptions, newMealOption],
              isCompleted: true,
            }
          : day
      );
    }

    // Only send days that have at least one meal option
    const dataToSave = updatedDaysData.filter(
      (day) => day.mealOptions.length > 0
    );

    if (dataToSave.length === 0) {
      toast.error("Please add at least one meal option before saving.");
      setIsLoading(false);
      return;
    }

    const submit = {
      planTitle: selectedPlan,
      days: dataToSave,
    };

    try {
      const response = await fetchWrapper("/admin/meal/save", {
        method: "POST",
        body: submit,
        // isFormData: true,
      });

      if (
        response.success ||
        response.message === "Meal plan saved successfully"
      ) {
        toast.success("Meal Plan Saved");
        reset();
        setDaysData(
          Array.from({ length: 7 }, (_, i) => ({
            day: i + 1,
            mealOptions: [],
            isCompleted: false,
          }))
        );
        setSelectedDay(1);
      } else {
        toast.error("Failed to save meal plan");
      }
    } catch (error) {
      console.error("Error submitting meal plan:", error);
      toast.error("Error submitting meal plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    const formData = watch();
    if (formData.foodName && formData.mealType) {
      const newMealOption: MealOption = {
        ...formData,
        id: Date.now().toString(),
      };
      const updatedDaysData = daysData.map((day) =>
        day.day === selectedDay
          ? {
              ...day,
              mealOptions: [...day.mealOptions, newMealOption],
              isCompleted: true,
            }
          : day
      );

      setDaysData(updatedDaysData);
      reset();

      if (selectedDay < 7) {
        setSelectedDay(selectedDay + 1);
      }
    }
  };

  const getButtonText = () => {
    const currentDayData = getCurrentDayData();
    const optionCount = currentDayData.mealOptions.length;

    if (optionCount === 0) return "Add Second Option";
    if (optionCount === 1) return "Add Third Option";
    return "";
  };

  if (selectedPlan) {
    const currentDayData = getCurrentDayData();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🍽️</span>
            <h1 className="text-3xl font-bold text-[#171616]">Meal Plans</h1>
          </div>
          <button
            onClick={handleBackToCards}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back to Meal Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#171616] mb-6">
            {getPlanTitle(selectedPlan)}
          </h2>

          <div className="flex space-x-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const dayData = daysData.find((d) => d.day === day);
              const isCompleted = dayData?.isCompleted || false;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 relative ${
                    isCompleted
                      ? "bg-gray-600 text-white border-gray-600"
                      : isSelected
                      ? "bg-[#EC1D13] text-white border-[#EC1D13]"
                      : "bg-white text-[#171616] border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>Day {day}</span>
                  {isCompleted && (
                    <div className="flex items-center justify-center bg-gray-600 rounded-full w-6 h-6 absolute -top-2 -right-2 border-2 border-white">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {currentDayData.mealOptions.map((option, index) => (
            <div
              key={option.id}
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <h4 className="font-semibold text-gray-700 mb-2">
                Option {index + 1}
              </h4>
              <p className="text-sm text-gray-600">Food: {option.foodName}</p>
              <p className="text-sm text-gray-600">Type: {option.mealType}</p>
              <p className="text-sm text-gray-600">
                Nutrition: {option.calories} cal, {option.protein}g protein,{" "}
                {option.fat}g fat, {option.carbs}g carbs
              </p>
            </div>
          ))}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Food Name
                </label>
                <input
                  type="text"
                  {...register("foodName")}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="Enter food name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Meal Type
                </label>
                <div className="relative">
                  <select
                    {...register("mealType")}
                    className="w-full px-4 py-3 pr-10 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="">Select meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  {...register("calories", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("protein", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Fat (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("fat", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("carbs", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                How to prepare it
              </label>
              <textarea
                {...register("preparation")}
                rows={4}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-none"
                placeholder="Enter preparation instructions..."
                required
              />
            </div>

            {currentDayData.mealOptions.length < 3 && (
              <div className="flex items-center space-x-2 mt-6">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <span className="text-black font-medium">
                  Need to add {3 - currentDayData.mealOptions.length} more diet
                  option{3 - currentDayData.mealOptions.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {!shouldShowSaveNext() && (
              <button
                type="submit"
                className="w-[320px] bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {getButtonText()}
              </button>
            )}
          </form>

          {shouldShowSaveNext() && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="w-[320px] bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleNext}
                className="w-[320px] bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🍽️</span>
        <h1 className="text-3xl font-bold text-[#171616]">Meal Plans</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 h-[700px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {mealPlanTypes.map((plan) => (
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
