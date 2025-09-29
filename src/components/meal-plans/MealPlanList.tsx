import { MealPlan } from "@/app/admin/personalized/page";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DeleteModal from "../DeleteModal";

interface MealPlanListProps {
  onEditPlan: (plan: MealPlan) => void;
  mealPlans: MealPlan[];
  getAllUserMealPlans: () => void;
}

export default function MealPlanList({
  onEditPlan,
  mealPlans,
  getAllUserMealPlans,
}: MealPlanListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<string>("");

  const handleDelete = async (mealPlanId: string) => {
    console.log(mealPlanId);
    try {
      toast.loading("Deleting meal...", { id: "meal-delete" });
      const result = await fetchWrapper(
        `/admin/meal/delete-user-meal-plan/${mealPlanId}`,
        {
          method: "DELETE",
        }
      );
      if (result.success) {
        toast.dismiss("meal-delete");
        toast.success("Meal deleted successfully!");
        getAllUserMealPlans();
      }
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      toast.dismiss("meal-delete");
      toast.error("Failed to delete meal.");
    } finally {
      setDeleteModalOpen(false);
      setSelectedMealPlanId("");
    }
  };
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-[#171616] mb-6">Meal Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlans?.map((item) => (
          <div
            key={item?._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* User Profile and Demographics */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                {/* eslint-disable-next-line  */}
                <img
                  src={
                    item?.userId?.profilePicture ||
                    "https://placehold.co/600x400?text=Image+Loading"
                  }
                  alt={item?.userId?.fullname || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#171616]">
                  {item?.userId?.fullname}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {item?.userId?.age} Y
                  </span>
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {item?.userId?.gender?.charAt(0).toUpperCase() +
                      item?.userId?.gender?.slice(1)}
                  </span>
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {item?.userId?.weight} lb
                  </span>
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                    {item?.userId?.height} Feet
                  </span>
                </div>
              </div>
            </div>

            {/* Meal Type Selection and Action */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Meal Type Selected</p>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[#171616]">
                  {item?.userId?.mealType}
                </h4>
                <button
                  onClick={() => onEditPlan(item)}
                  className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
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
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedMealPlanId(item?._id || "");
                    setDeleteModalOpen(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Joined Date */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Joined Date: {item?.userId?.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          description="Are you sure you want to delete this meal plan?"
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDelete(selectedMealPlanId)}
        />
      )}
      <Toaster />
    </div>
  );
}
