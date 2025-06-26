"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface WorkoutPlan {
  _id?: string;
  name: string;
  muscleGroup: string;
  setType: string;
  reps: string;
  video: FileList;
  equipments: { value: string }[];
  comments: string;
  suggestion?: string;
  createdAt?: string;
}

export default function WorkoutPlansPage() {
  const { register, handleSubmit, control, reset } = useForm<WorkoutPlan>({
    defaultValues: {
      equipments: [{ value: "" }],
    },
  });
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [fetchingMealPlans, setFetchingMealPlans] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWorkout = async () => {
    try {
      const response = await fetchWrapper<any>("/admin/workout/all", {
        method: "GET",
      });
      // Ensure response is an array, handle different response structures
      const workoutPlansArray = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
        ? response.data
        : response?.workouts && Array.isArray(response.workouts)
        ? response.workouts
        : [];
      
      setWorkoutPlans(workoutPlansArray);
    } catch (error) {
      toast.error("Failed to fetch meal plans");
      console.error("Error fetching meal plans:", error);
      setWorkoutPlans([]); // Set empty array on error
    } finally {
      setFetchingMealPlans(false);
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, []);
  console.log("Workout Plans:", workoutPlans);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "equipments",
  });

  const onSubmit = async (data: WorkoutPlan) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("muscleGroup", data.muscleGroup);
    formData.append("setType", data.setType);
    formData.append("reps", data.reps);
    formData.append("comments", data.comments);
    if (data.suggestion) formData.append("suggestion", data.suggestion);

    data.equipments.forEach((e) => formData.append("equipments", e.value));

    if (data.video?.length) {
      formData.append("video", data.video[0]);
    }

    try {
      const res = await fetchWrapper("/admin/workout/save", {
        method: "POST",
        body: formData,
        isFormData: true,
      });

      toast.success("Workout plan added!");
      fetchWorkout();
      console.log("Saved workout:", res.workout);
      reset();
      setLoading(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add workout plan");
      console.error(err);
      setLoading(false);
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Workout Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="e.g., Dumbbell Incline Bench Press"
                required
              />
            </div>
            <div>
              <label
                htmlFor="muscleGroup"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Muscle Group
              </label>
              <input
                type="text"
                id="muscleGroup"
                {...register("muscleGroup")}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="e.g., Chest"
                required
              />
            </div>
            <div>
              <label
                htmlFor="setType"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Set Type
              </label>
              <input
                type="text"
                id="setType"
                {...register("setType")}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="e.g., Normal Set"
                required
              />
            </div>
            <div>
              <label
                htmlFor="reps"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Reps
              </label>
              <input
                type="text"
                id="reps"
                {...register("reps")}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="e.g., 10/10/10"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="video"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Video
            </label>
            <input
              type="file"
              id="video"
              accept="video/*"
              {...register("video")}
              className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EC1D13] file:text-white hover:file:bg-[#d41910] file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Equipments
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`equipments.${index}.value`)}
                  className="flex-1 px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                  placeholder={`Equipment ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-[#171616] text-white p-3 rounded-lg hover:bg-black transition-colors flex-shrink-0"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="mt-2 bg-[#171616] text-white py-2 px-4 rounded-lg text-sm hover:bg-black transition-colors"
            >
              Add Equipment
            </button>
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Additional Comments
            </label>
            <textarea
              id="comments"
              {...register("comments")}
              rows={4}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="Add any additional comments or instructions..."
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="suggestion"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Workout Suggestion (Optional)
            </label>
            <input
              type="text"
              id="suggestion"
              {...register("suggestion")}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="e.g., Cardio 40min"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Adding..." : "Add Workout Plan"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          All Workout
        </h2>

        {fetchingMealPlans ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC1D13]"></div>
          </div>
        ) : workoutPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No Workout found. Add some!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Muscle Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Set Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Reps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Equipments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    suggestion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(workoutPlans) &&
                  workoutPlans.map((mealPlan, index) => (
                    <tr
                      key={mealPlan._id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mealPlan.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">
                          {mealPlan.muscleGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.setType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.reps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.equipments.map((e, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
                          >
                            {e as any}
                          </span>
                        ))}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        title={mealPlan.comments}
                      >
                        {mealPlan.comments.slice(0, 15) + "..."}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.suggestion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan.createdAt
                          ? new Date(mealPlan.createdAt).toLocaleDateString()
                          : "N/A"}
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
