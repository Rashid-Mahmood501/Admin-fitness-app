import { DaySelectionStepProps } from "../types";

export function DaySelectionStep({ selectedDays, onDaySelection, onContinue }: DaySelectionStepProps) {
  const availableDays = [3, 4, 5, 6, 7];

  return (
    <>
      <h2 className="text-2xl font-bold text-[#171616] mb-6">
        Create Exercise Plan
      </h2>
      <p className="text-gray-600 mb-8">
        Select the days split you want to create for
      </p>

      <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide">
        {availableDays.map((day) => (
          <button
            key={day}
            onClick={() => onDaySelection(day)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedDays.includes(day)
                ? "bg-[#EC1D13] text-white"
                : "bg-white text-black border border-black hover:bg-gray-50"
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      <div>
        <button
          onClick={onContinue}
          disabled={selectedDays.length === 0}
          className="px-32 py-3 bg-[#EC1D13] text-white rounded-lg font-semibold hover:bg-[#d41910] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </>
  );
} 