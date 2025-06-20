'use client';

import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

interface Supplement {
  name: string;
  description: string;
}


export default function SupplementsPage() {
  const { register, handleSubmit } = useForm<Supplement>();

  const onSubmit = (data: Supplement) => {
    console.log('Form submitted:', data);
    toast.success('Supplement data submitted!');
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">💊</span>
        <h1 className="text-3xl font-bold text-[#171616]">Supplements</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          Add New Supplement
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              Supplement Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="Enter supplement name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-vertical"
              placeholder="Enter supplement description..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Add Supplement
          </button>
        </form>
      </div>
      <Toaster
      position="top-right"
      />
    </div>
  );
} 