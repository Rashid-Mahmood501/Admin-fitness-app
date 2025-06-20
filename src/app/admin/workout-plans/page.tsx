'use client';

import { useForm, useFieldArray } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

interface WorkoutPlan {
  name: string;
  muscleGroup: string;
  setType: string;
  reps: string;
  image: FileList;
  video: FileList;
  equipments: { value: string }[];
  comments: string;
  suggestion?: string;
}

export default function WorkoutPlansPage() {
  const { register, handleSubmit, control } = useForm<WorkoutPlan>({
    defaultValues: {
      equipments: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipments",
  });

  const onSubmit = (data: WorkoutPlan) => {
    const finalData = {
      ...data,
      equipments: data.equipments.map(e => e.value),
      image: data.image[0],
      video: data.video[0]
    };
    console.log('Form submitted:', finalData);
    toast.success('Workout plan data submitted!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">💪</span>
        <h1 className="text-3xl font-bold text-[#171616]">Workout Plans</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          Add New Workout Plan
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Workout Name</label>
              <input type="text" id="name" {...register("name")} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="e.g., Dumbbell Incline Bench Press" required />
            </div>
            <div>
              <label htmlFor="muscleGroup" className="block text-sm font-bold text-gray-700 mb-2">Muscle Group</label>
              <input type="text" id="muscleGroup" {...register("muscleGroup")} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="e.g., Chest" required />
            </div>
            <div>
              <label htmlFor="setType" className="block text-sm font-bold text-gray-700 mb-2">Set Type</label>
              <input type="text" id="setType" {...register("setType")} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="e.g., Normal Set" required />
            </div>
            <div>
              <label htmlFor="reps" className="block text-sm font-bold text-gray-700 mb-2">Reps</label>
              <input type="text" id="reps" {...register("reps")} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="e.g., 10/10/10" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="image" className="block text-sm font-bold text-gray-700 mb-2">Image</label>
              <input type="file" id="image" accept="image/*" {...register("image")} className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer" required />
            </div>
            <div>
              <label htmlFor="video" className="block text-sm font-bold text-gray-700 mb-2">Video</label>
              <input type="file" id="video" accept="video/*" {...register("video")} className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Equipments</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`equipments.${index}.value`)}
                  className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder={`Equipment ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => remove(index)} className="bg-[#171616] text-white p-3 rounded-lg hover:bg-black transition-colors">-</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ value: "" })} className="mt-2 bg-[#171616] text-white py-2 px-4 rounded-lg text-sm hover:bg-black transition-colors">
              Add Equipment
            </button>
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-bold text-gray-700 mb-2">Additional Comments</label>
            <textarea id="comments" {...register("comments")} rows={4} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="Add any additional comments or instructions..."></textarea>
          </div>
          
          <div>
            <label htmlFor="suggestion" className="block text-sm font-bold text-gray-700 mb-2">Workout Suggestion (Optional)</label>
            <input type="text" id="suggestion" {...register("suggestion")} className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors" placeholder="e.g., Cardio 40min" />
          </div>

          <button type="submit" className="w-full bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg">
            Add Workout Plan
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 