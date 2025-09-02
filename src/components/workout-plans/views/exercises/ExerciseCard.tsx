import DeleteModal from "@/components/DeleteModal";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Exercise } from "../../types";

interface ExerciseCardProps {
  exercise: Exercise;
  onEditExercise: (exerciseId: string) => void;
  isAlternative?: boolean;
  fetchExercises: () => void;
}

export function ExerciseCard({
  exercise,
  onEditExercise,
  isAlternative = false,
  fetchExercises,
}: ExerciseCardProps) {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = async (exerciseId: string) => {
    console.log("Delete exercise with ID:", exerciseId);
    try {
      toast.loading("Deleting exercise...", { id: "exercise-delete" });
      const result = await fetchWrapper(`/admin/workout/delete/${exerciseId}`, {
        method: "DELETE",
      });
      if (result.success) {
        toast.dismiss("exercise-delete");
        toast.success("Exercise deleted successfully!");
        fetchExercises();
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.dismiss("exercise-delete");
      toast.error("Failed to delete exercise.");
    } finally {
      setDeleteModalOpen(false);
      setSelectedExercise("");
    }
  };
  return (
    <div
      className={`rounded-lg p-4 ${
        isAlternative
          ? "w-64 min-w-[16rem] max-w-[18rem] p-2"
          : "border border-black"
      }`}
    >
      <div
        className={`flex gap-6 items-center ${
          isAlternative ? "" : "flex-col sm:flex-row"
        }`}
      >
        <div>
          <div
            className={`relative bg-white border border-black rounded-lg overflow-hidden ${
              isAlternative ? "w-56" : "w-[320px]"
            }`}
          >
            <div
              className={`bg-gray-200 relative ${
                isAlternative ? "h-38" : "h-48"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {/* eslint-disable-next-line */}
                <img
                  src={exercise.cardImage || "/exercise_image.jpg"}
                  alt="Exercise Image"
                  width={isAlternative ? 224 : 320}
                  height={isAlternative ? 128 : 200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => {
                    setSelectedExercise(exercise._id || "");
                    setDeleteModalOpen(true);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => onEditExercise(exercise._id)}
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
                <h3
                  className={`font-semibold ${
                    isAlternative ? "text-base" : "text-lg"
                  }`}
                >
                  {exercise.name}
                </h3>
                <p className={`text-sm ${isAlternative ? "text-xs" : ""}`}>
                  Reps {exercise.reps}
                </p>
                <span
                  className={`bg-[#EC1D13] text-white px-3 py-1 rounded ${
                    isAlternative ? "text-xs px-2 py-0.5" : "text-sm"
                  }`}
                >
                  {exercise.setType}
                </span>
              </div>
            </div>
          </div>
        </div>
        {!isAlternative && (
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#171616] mb-1">Equipment Options</h3>
            {exercise.alternatives && exercise.alternatives.length > 0 ? (
              <div className="flex flex-row flex-wrap gap-4 mt-2">
                {exercise.alternatives.map((alt, idx) => (
                  <div key={alt._id || idx}>
                    <ExerciseCard
                      exercise={alt}
                      onEditExercise={onEditExercise}
                      isAlternative={true}
                      fetchExercises={fetchExercises}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Not found</p>
            )}
          </div>
        )}
      </div>
      {deleteModalOpen && (
        <DeleteModal
          description="Are you sure you want to delete this exercise?"
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDelete(selectedExercise)}
        />
      )}
      <Toaster />
    </div>
  );
}
