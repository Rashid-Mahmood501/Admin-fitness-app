'use client';

import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

interface MealPlan {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image: FileList;
}

export default function MealPlansPage() {
  const { register, handleSubmit } = useForm<MealPlan>();

  const onSubmit = (data: MealPlan) => {
    console.log('Form submitted:', data);
    console.log('Image file:', data.image[0]);
    toast.success('Meal plan data submitted!');
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
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-bold text-gray-700 mb-2">
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
              <label htmlFor="protein" className="block text-sm font-bold text-gray-700 mb-2">
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
              <label htmlFor="fat" className="block text-sm font-bold text-gray-700 mb-2">
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
              <label htmlFor="carbs" className="block text-sm font-bold text-gray-700 mb-2">
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
            <label htmlFor="image" className="block text-sm font-bold text-gray-700 mb-2">
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
            Add Meal Plan
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 