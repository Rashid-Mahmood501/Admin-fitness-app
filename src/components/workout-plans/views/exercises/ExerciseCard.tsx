import { Exercise } from "../../types";

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
}

export function ExerciseCard({ exercise, onEdit }: ExerciseCardProps) {
  return (
    <div className="border border-black rounded-lg p-4">
      <div className="flex gap-6 items-center flex-col sm:flex-row">
        <div>
          <div className="relative bg-white border border-black rounded-lg overflow-hidden w-[320px]">
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <img
                  src="/exercise_image.png"
                  alt="Exercise Image"
                  width={320}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={onEdit}
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
                <h3 className="text-lg font-semibold">
                  {exercise.name}
                </h3>
                <p className="text-sm">Reps {exercise.reps}</p>
                <span className="bg-[#EC1D13] text-white px-3 py-1 rounded text-sm">
                  {exercise.setType}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-64">
          <h3 className="font-bold text-[#171616] mb-1">
            Equipment Options
          </h3>
          <p className="text-gray-500">Not found</p>
        </div>
      </div>
    </div>
  );
} 