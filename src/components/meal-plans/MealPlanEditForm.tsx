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

interface MealPlan {
  _id?: string;
  id: string;
  title: string;
  type: string;
  createdAt: string;
  days: {
    day: number;
    mealOptions: MealOption[];
  }[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

interface MealPlanEditFormProps {
  mealPlan: MealPlan;
  onSave: (updatedMealPlan: MealPlan) => void;
  onCancel: () => void;
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"];

export default function MealPlanEditForm({
  mealPlan,
  onSave,
  onCancel,
}: MealPlanEditFormProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState<string>("breakfast");
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [daysData, setDaysData] = useState(mealPlan.days);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<MealOption>();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Uploading image...", { id: "image-upload" });
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetchWrapper<{ imageUrl: string }>(
        "/admin/meal/upload-image",
        {
          method: "POST",
          body: formData,
          isFormData: true,
        }
      );
      if (response.imageUrl) {
        setValue("image", response.imageUrl);
        toast.dismiss("image-upload");
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
      return;
    }
  };

  const getCurrentDayData = () => {
    return daysData.find((day) => day.day === selectedDay) || daysData[0];
  };

  const getMealOptionsByType = (mealType: string) => {
    const currentDayData = getCurrentDayData();
    return currentDayData.mealOptions.filter(
      (option) => option.mealType === mealType
    );
  };

  const handleEditMeal = (meal: MealOption) => {
    setEditingMealId(meal.id);
    setValue("foodName", meal.foodName);
    setValue("calories", meal.calories);
    setValue("protein", meal.protein);
    setValue("fat", meal.fat);
    setValue("carbs", meal.carbs);
    setValue("image", meal.image);
    setValue("preparation", meal.preparation);
  };

  const handleUpdateMeal = async () => {
    const formData = watch();
    if (!editingMealId || !formData.foodName) return;

    const updatedDaysData = daysData.map((day) => {
      if (day.day === selectedDay) {
        return {
          ...day,
          mealOptions: day.mealOptions.map((meal) =>
            meal.id === editingMealId ? { ...meal, ...formData } : meal
          ),
        };
      }
      return day;
    });

    const dataToSave = {
      ...formData,
      id: editingMealId,
      mealPlanId: mealPlan._id,
      mealType: selectedMealType,
      day: selectedDay,
    };
    try {
      toast.loading("Updating meal...", { id: "meal-update" });
      const result = await fetchWrapper("/admin/meal/update-meal-in-day", {
        method: "PUT",
        body: dataToSave,
      });
      if (result.success) {
        toast.dismiss("meal-update");
        setDaysData(updatedDaysData);
        setEditingMealId(null);
        reset();
        toast.success("Meal updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update meal:", error);
      toast.error("Failed to update meal. Please try again.");
      toast.dismiss("meal-update");
      return;
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    const updatedDaysData = daysData.map((day) => {
      if (day.day === selectedDay) {
        return {
          ...day,
          mealOptions: day.mealOptions.filter((meal) => meal.id !== mealId),
        };
      }
      return day;
    });

    const dataToSave = {
      id: mealId,
      mealPlanId: mealPlan._id,
      day: selectedDay,
    };
    try {
      toast.loading("Deleting meal...", { id: "meal-delete" });
      const result = await fetchWrapper("/admin/meal/delete-meal-from-day", {
        method: "DELETE",
        body: dataToSave,
      });
      if (result.success) {
        toast.dismiss("meal-delete");
        setDaysData(updatedDaysData);
        toast.success("Meal deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete meal:", error);
      toast.error("Failed to delete meal. Please try again.");
      toast.dismiss("meal-delete");
      return;
    }
  };

  const handleAddMeal = async () => {
    const formData = watch();
    if (!formData.foodName) return;

    const newMealOption: MealOption = {
      ...formData,
      id: Date.now().toString(),
      mealType: selectedMealType,
    };

    const updatedDaysData = daysData.map((day) => {
      if (day.day === selectedDay) {
        return {
          ...day,
          mealOptions: [...day.mealOptions, newMealOption],
        };
      }
      return day;
    });

    const dataToSave = {
      ...newMealOption,
      mealPlanId: mealPlan._id,
      day: selectedDay,
    };

    try {
      toast.loading("Adding meal...", { id: "meal-add" });
      const result = await fetchWrapper("/admin/meal/add-meal-to-day", {
        method: "POST",
        body: dataToSave,
      });
      if (result.success) {
        toast.dismiss("meal-add");
        setDaysData(updatedDaysData);
        reset();
        toast.success("Meal added successfully!");
      }
    } catch (error) {
      console.error("Failed to add meal:", error);
      toast.error("Failed to add meal. Please try again.");
      toast.dismiss("meal-add");
      return;
    }
  };

  const handleSavePlan = () => {
    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    daysData.forEach((day) => {
      day.mealOptions.forEach((meal) => {
        totalCalories += meal.calories;
        totalProtein += meal.protein;
        totalFat += meal.fat;
        totalCarbs += meal.carbs;
      });
    });

    const updatedMealPlan: MealPlan = {
      ...mealPlan,
      days: daysData,
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs,
    };

    onSave(updatedMealPlan);
    toast.success("Meal plan updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">✏️</span>
          <h1 className="text-3xl font-bold text-[#171616]">Edit Meal Plan</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePlan}
            className="px-6 py-2 bg-[#EC1D13] text-white rounded-lg hover:bg-[#d41910] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#171616] mb-2">
            {mealPlan.title}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#EC1D13] text-white text-sm rounded-full capitalize">
              {mealPlan.type}
            </span>
            <span className="text-gray-500">• {mealPlan.days.length} days</span>
          </div>
        </div>

        {/* Day Selection */}
        <div className="flex space-x-4 overflow-x-auto py-6 scrollbar-hide mb-6">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const dayData = daysData.find((d) => d.day === day);
            const isSelected = selectedDay === day;
            const hasMeals =
              dayData?.mealOptions && dayData?.mealOptions?.length > 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 relative ${
                  hasMeals
                    ? ` ${
                        isSelected
                          ? "bg-[#EC1D13] text-white border-[#EC1D13]"
                          : "bg-green-100 text-green-800 border-green-300"
                      }`
                    : "bg-green-100 text-green-800 border-green-300"
                }`}
              >
                <span>Day {day}</span>
                {hasMeals && dayData && (
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${
                      isSelected
                        ? "bg-white text-[#EC1D13]"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {dayData.mealOptions?.length || 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Meal Type Selection */}
        <div className="flex space-x-4 mb-8 overflow-x-auto py-2 scrollbar-hide">
          {MEAL_TYPES.map((mealType) => {
            const isSelected = selectedMealType === mealType;
            const mealCount = getMealOptionsByType(mealType).length;

            return (
              <button
                key={mealType}
                onClick={() => setSelectedMealType(mealType)}
                className={`px-6 py-2 rounded-lg border font-medium transition-colors flex items-center space-x-2 relative capitalize ${
                  isSelected
                    ? "bg-[#EC1D13] text-white border-[#EC1D13]"
                    : "bg-white text-[#171616] border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>{mealType}</span>
                {mealCount > 0 && (
                  <span className="text-xs bg-white text-[#EC1D13] rounded-full px-2 py-1">
                    {mealCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Existing Meals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Current{" "}
              {selectedMealType.charAt(0).toUpperCase() +
                selectedMealType.slice(1)}{" "}
              Meals
            </h3>
            <div className="space-y-3">
              {getMealOptionsByType(selectedMealType).map((meal) => (
                <div
                  key={meal.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {meal.foodName}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMeal(meal)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-24 h-24 mb-2 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line  */}
                      <img
                        src={meal.image}
                        alt={meal.foodName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Calories: {meal.calories}</div>
                      <div>Protein: {meal.protein}g</div>
                      <div>Fat: {meal.fat}g</div>
                      <div>Carbs: {meal.carbs}g</div>
                    </div>
                  </div>
                  {meal.preparation && (
                    <div className="mt-2 text-sm text-gray-600 line-clamp-3">
                      <strong>Preparation:</strong> {meal.preparation}
                    </div>
                  )}
                </div>
              ))}
              {getMealOptionsByType(selectedMealType).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {selectedMealType} meals added yet
                </div>
              )}
            </div>
          </div>

          {/* Add/Edit Meal Form */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingMealId ? "Edit Meal" : "Add New Meal"}
            </h3>
            <form
              onSubmit={handleSubmit(
                editingMealId ? handleUpdateMeal : handleAddMeal
              )}
              className="space-y-4"
            >
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

              <div className="grid grid-cols-2 gap-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Preparation Instructions
                </label>
                <textarea
                  {...register("preparation")}
                  rows={3}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-none"
                  placeholder="Enter preparation instructions..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200"
                >
                  {editingMealId ? "Update Meal" : "Add Meal"}
                </button>
                {editingMealId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMealId(null);
                      reset();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
