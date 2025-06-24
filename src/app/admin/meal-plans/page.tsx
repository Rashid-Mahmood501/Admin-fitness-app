"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface MealPlan {
  _id?: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image: FileList;
  imageUrl?: string;
  createdAt?: string;
  type?: string;
}

export default function MealPlansPage() {
  const { register, handleSubmit, reset } = useForm<MealPlan>();
  const [loading, setLoading] = useState(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [fetchingMealPlans, setFetchingMealPlans] = useState(true);

  // Fetch all meal plans on component mount
  useEffect(() => {
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await fetchWrapper<any>("/admin/meal/all", {
        method: "GET",
      });
      console.log(response);
      // Ensure response is an array, handle different response structures
      const mealPlansArray = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
        ? response.data
        : response?.meals && Array.isArray(response.meals)
        ? response.meals
        : [];
      
      // Sort by creation date (newest first)
      const sortedMealPlans = mealPlansArray.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a._id || 0);
        const dateB = new Date(b.createdAt || b._id || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setMealPlans(sortedMealPlans);
    } catch (error) {
      toast.error("Failed to fetch meal plans");
      console.error("Error fetching meal plans:", error);
      setMealPlans([]); // Set empty array on error
    } finally {
      setFetchingMealPlans(false);
    }
  };

  const onSubmit = async (data: MealPlan) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("mealType", data.mealType);
      formData.append("calories", String(data.calories));
      formData.append("protein", String(data.protein));
      formData.append("fat", String(data.fat));
      formData.append("carbs", String(data.carbs));
      formData.append("image", data.image[0]);

      const response = await fetchWrapper("/admin/meal/save", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      if (!response) {
        throw new Error("Failed to add meal plan");
      }
      toast.success("Meal plan added successfully!");
      reset();
      await fetchMealPlans();
    } catch (err: any) {
      toast.error("Failed to add meal plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">🍽️</span>
        <h1 className="text-3xl font-bold text-[#171616]">Meal Plans</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          Add New Meal Plan
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Food Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="Enter food name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="mealType"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Meal Type
            </label>
            <div className="relative">
              <select
                id="mealType"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="calories"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Calories
              </label>
              <input
                type="number"
                id="calories"
                {...register("calories", { valueAsNumber: true })}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="protein"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Protein (g)
              </label>
              <input
                type="number"
                step="0.1"
                id="protein"
                {...register("protein", { valueAsNumber: true })}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="0.0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fat"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                id="fat"
                {...register("fat", { valueAsNumber: true })}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="0.0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="carbs"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Carbs (g)
              </label>
              <input
                type="number"
                step="0.1"
                id="carbs"
                {...register("carbs", { valueAsNumber: true })}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="0.0"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              {...register("image")}
              className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Adding..." : "Add Meal Plan"}
          </button>
        </form>
      </div>

      {/* Meal Plans Table */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          All Meal Plans
        </h2>

        {fetchingMealPlans ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC1D13]"></div>
          </div>
        ) : mealPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No meal plans found. Add your first meal plan above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Meal Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Calories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Protein (g)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Fat (g)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Carbs (g)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(mealPlans) &&
                  mealPlans.map((mealPlan, index) => (
                    <tr
                      key={mealPlan._id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={(mealPlan.image as any) || "/placeholder.png"}
                          alt={mealPlan.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mealPlan.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">
                          {mealPlan?.type as any}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.protein}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.fat}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.carbs}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
