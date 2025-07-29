interface MealPlanListProps {
  onEditPlan: (userId: string) => void;
}

export default function MealPlanList({ onEditPlan }: MealPlanListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-[#171616] mb-6">Meal Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* User Profile and Demographics */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img
                  src="https://placehold.co/600x400?text=Image+Loading"
                  alt="William Jones"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#171616]">William Jones</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">31y</span>
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">Male</span>
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">60KG</span>
                  <span className="px-2 py-1 bg-black text-white text-xs rounded-full">5.8</span>
                </div>
              </div>
            </div>

            {/* Meal Type Selection and Action */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Meal Type Selected</p>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[#171616]">Diet On Budget</h4>
                <button
                  onClick={() => onEditPlan("diet-on-budget")}
                  className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Meal Plan</span>
                </button>
              </div>
            </div>

            {/* Joined Date */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Joined on 28/07/2025 | 05:00 PM
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 