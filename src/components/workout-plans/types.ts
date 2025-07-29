export interface WorkoutPlanTypes {
  id: string;
  title: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Exercise {
  _id: string;
  name: string;
  category: string;
  reps: string;
  setType: string;
  image: string;
  muscleGroup?: string;
  comments?: string;
  suggestion?: string;
  alternatives?: Exercise[];
}

export interface ExerciseForm {
  workoutName: string;
  setType: string;
  video: string;
  muscleGroup: string;
  reps: string;
  additionalComments: string;
  workoutSuggestion: string;
  alternativeCount?: number;
  alternativeExercises?: {
    category: string;
    exercise: ExerciseForm;
  }[];
}

export interface DaySelectionStepProps {
  selectedDays: number[];
  onDaySelection: (day: number) => void;
  onContinue: () => void;
}

export interface CategorySelectionStepProps {
  selectedDays: number[];
  currentDay: number;
  dayCategories: { [key: number]: string };
  dayExercises: { [key: number]: string[] };
  onDayChange: (day: number) => void;
  onCategorySelection: (day: number, category: string) => void;
  onExerciseSelection: () => void;
  onCreatePlan: () => void;
  creatingPlan?: boolean;
}

export interface ExerciseSelectionStepProps {
  currentDay: number;
  selectedCategory?: string;
  selectedExercises: string[];
  onExerciseSelection: (day: number, exerciseId: string) => void;
  onConfirm: () => void;
  onBack?: () => void;
}

export interface WorkoutPlanHeaderProps {
  onBack: () => void;
}

export interface WorkoutPlan {
  _id: string;
  workoutPlanId: string;
  title: string;
  type: string;
  createdAt: string;
  selectedDays: number[];
  dayCategories: { [key: number]: string };
  dayExercises: { [key: number]: string[] };
  exercises?: Exercise[];
}
