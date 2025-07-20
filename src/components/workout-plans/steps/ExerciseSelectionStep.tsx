import Image from "next/image";
import { ExerciseSelectionStepProps } from "../types";

export function ExerciseSelectionStep({
  currentDay,
  selectedExercises,
  onExerciseSelection,
  onConfirm,
}: ExerciseSelectionStepProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#171616]">Select Exercises</h2>
        <div>
          <button
            onClick={onConfirm}
            className="px-8 py-1.5 bg-[#EC1D13] text-white rounded-lg text-sm font-semibold hover:bg-[#d41910] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border border-black rounded-lg p-6">
          <div className="flex gap-6">
            <div className="flex-1 flex items-center gap-6">
              <div>
                <div className="relative bg-white border border-black rounded-lg overflow-hidden w-[320px]">
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      <Image
                        src="/exercise_image.png"
                        alt="Exercise Image"
                        width={320}
                        height={200}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="w-8 h-8 bg-white border border-black rounded-full flex items-center justify-center hover:bg-gray-50">
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
                        Incline Chest Press
                      </h3>
                      <p className="text-sm">Reps 10/10/10</p>
                      <span className="bg-[#EC1D13] text-white px-3 py-1 rounded text-sm">
                        Normal Set
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-64">
                <h3 className="font-bold text-[#171616] mb-2">
                  Equipment Options
                </h3>
                <p className="text-gray-500">Not found</p>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                checked={selectedExercises.includes("exercise-1")}
                onChange={() => onExerciseSelection(currentDay, "exercise-1")}
                className="w-5 h-5 text-[#EC1D13] border-gray-300 focus:ring-[#EC1D13] accent-[#EC1D13]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 