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
  image: string;
  preparation: string;
}

interface DayData {
  day: number;
  mealOptions: MealOption[];
  isCompleted: boolean;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

export default function MealPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState<string>("breakfast");
  const [currentOption, setCurrentOption] = useState(1);
  const [daysData, setDaysData] = useState<DayData[]>(
    Array.from({ length: 7 }, (_, i) => ({
      day: i + 1,
      mealOptions: [],
      isCompleted: false,
    }))
  );
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<MealOption>();

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
    setSelectedMealType("breakfast");
    setCurrentOption(1);
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
    console.log(data);
    
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

  const handleNext = () => {
    const formData = watch();
    if (formData.foodName) {
      const newMealOption: MealOption = {
        ...formData,
        id: Date.now().toString(),
        mealType: selectedMealType,
      };
      
      console.log("Adding meal option:", newMealOption);
      
      setDaysData((prev) =>
        prev.map((day) =>
          day.day === selectedDay
            ? { ...day, mealOptions: [...day.mealOptions, newMealOption] }
            : day
        )
      );
      
      reset();
      const currentMealTypeIndex = MEAL_TYPES.indexOf(selectedMealType);
      
      if (currentMealTypeIndex < MEAL_TYPES.length - 1) {
        setSelectedMealType(MEAL_TYPES[currentMealTypeIndex + 1]);
      } else {
        if (currentOption < 3) {
          setCurrentOption(currentOption + 1);
          setSelectedMealType("breakfast");
        } else {
          if (selectedDay < 7) {
            setSelectedDay(selectedDay + 1);
            setCurrentOption(1);
            setSelectedMealType("breakfast");
          }
        }
      }
    }
  };

  const handleSave = () => {
    const formDataToSave = watch();
    let updatedDaysData = daysData;
    if (formDataToSave.foodName) {
      const newMealOption: MealOption = {
        ...formDataToSave,
        id: Date.now().toString(),
        mealType: selectedMealType,
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

    const dataToSave = updatedDaysData.filter(
      (day) => day.mealOptions.length > 0
    );

    if (dataToSave.length === 0) {
      console.log("No meal options to save");
      return;
    }

    const organizedData: {
      planTitle: string | null;
      breakfast: Array<MealOption & { day: number }>;
      lunch: Array<MealOption & { day: number }>;
      dinner: Array<MealOption & { day: number }>;
      snacks: Array<MealOption & { day: number }>;
    } = {
      planTitle: selectedPlan,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };

    dataToSave.forEach(day => {
      day.mealOptions.forEach(option => {
        switch(option.mealType) {
          case 'breakfast':
            organizedData.breakfast.push({
              day: day.day,
              ...option
            });
            break;
          case 'lunch':
            organizedData.lunch.push({
              day: day.day,
              ...option
            });
            break;
          case 'dinner':
            organizedData.dinner.push({
              day: day.day,
              ...option
            });
            break;
          case 'snacks':
            organizedData.snacks.push({
              day: day.day,
              ...option
            });
            break;
        }
      });
    });

    console.log("Organized meal plan data:", organizedData);
    reset();
    setDaysData(
      Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        mealOptions: [],
        isCompleted: false,
      }))
    );
    setSelectedDay(1);
    setSelectedMealType("breakfast");
    setCurrentOption(1);
  };

  const getMealOptionsForCurrentDay = () => {
    const currentDayData = getCurrentDayData();
    return currentDayData.mealOptions;
  };

  const getMealOptionsByType = (mealType: string) => {
    const options = getMealOptionsForCurrentDay();
    return options.filter(option => option.mealType === mealType);
  };

  const isMealTypeCompleted = (mealType: string) => {
    const options = getMealOptionsByType(mealType);
    return options.length >= currentOption;
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

          <div className="flex space-x-4 overflow-x-auto py-6 scrollbar-hide">
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

                      {/* Show previously entered meal options organized by meal type */}
            {currentDayData.mealOptions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-4">Previously Added Meals:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEAL_TYPES.map((mealType) => {
                    const mealOptions = currentDayData.mealOptions.filter(
                      option => option.mealType === mealType
                    );
                    
                    if (mealOptions.length === 0) return null;
                    
                    return (
                      <div key={mealType} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <h5 className="font-semibold text-gray-700 mb-2 capitalize">
                          {mealType} ({mealOptions.length} item{mealOptions.length > 1 ? 's' : ''})
                        </h5>
                        {mealOptions.map((option) => (
                          <div key={option.id} className="mb-2 p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-800">{option.foodName}</p>
                            <p className="text-xs text-gray-600">
                              {option.calories} cal | P: {option.protein}g | F: {option.fat}g | C: {option.carbs}g
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex space-x-4 mb-8 overflow-x-auto py-2 scrollbar-hide">
              {MEAL_TYPES.map((mealType) => {
                const isCompleted = isMealTypeCompleted(mealType);
                const isSelected = selectedMealType === mealType;

                return (
                  <button
                    key={mealType}
                    onClick={() => setSelectedMealType(mealType)}
                    className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 relative capitalize ${
                      isCompleted
                        ? "bg-gray-600 text-white border-gray-600"
                        : isSelected
                        ? "bg-[#EC1D13] text-white border-[#EC1D13]"
                        : "bg-white text-[#171616] border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span>{mealType}</span>
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

            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">
                Option {currentOption} - {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
              </h3>
            </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex items-center space-x-2 mt-6">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <span className="text-black font-medium">
                Adding {selectedMealType} for Option {currentOption}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-[320px] bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Next
            </button>
          </form>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="w-[320px] bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Save
            </button>
          </div>
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
