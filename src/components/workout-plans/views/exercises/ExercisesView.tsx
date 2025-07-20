"use client";

import { useState } from "react";
import { WorkoutPlanHeader } from "../../WorkoutPlanHeader";
import { Exercise, ExerciseForm } from "../../types";
import { CreateExerciseForm } from "./CreateExerciseForm";
import { ExerciseList } from "./ExerciseList";

export function ExercisesView({ onBack }: { onBack: () => void }) {
  const [showCreateExerciseForm, setShowCreateExerciseForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("chest");

  const exercises: Exercise[] = [
    {
      id: "1",
      name: "Incline Chest Press",
      category: "chest",
      reps: "10/10/10",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "2", 
      name: "Dumbbell Flyes",
      category: "chest",
      reps: "12/12/12",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "3",
      name: "Bicep Curls",
      category: "arm",
      reps: "15/15/15",
      setType: "Normal Set",
      image: "/exercise_image.png"
    },
    {
      id: "4",
      name: "Tricep Dips",
      category: "arm", 
      reps: "8/8/8",
      setType: "Normal Set",
      image: "/exercise_image.png"
    }
  ];

  const handleCreateExercise = () => {
    setShowCreateExerciseForm(true);
    setIsEditMode(false);
    setEditingExerciseId("");
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setIsEditMode(true);
      setEditingExerciseId(exerciseId);
      setShowCreateExerciseForm(true);
    }
  };

  const handleBackToExercises = () => {
    setShowCreateExerciseForm(false);
    setIsEditMode(false);
    setEditingExerciseId("");
  };

  const handleFormSubmit = (formData: ExerciseForm & { selectedCategory: string }) => {
    if (isEditMode) {
      console.log("Updating exercise:", {
        id: editingExerciseId,
        ...formData
      });
    } else {
      console.log("Creating exercise:", formData);
    }
    handleBackToExercises();
  };

  if (showCreateExerciseForm) {
    return (
      <CreateExerciseForm
        isEditMode={isEditMode}
        editingExercise={isEditMode ? exercises.find(ex => ex.id === editingExerciseId) : undefined}
        onSubmit={handleFormSubmit}
        onBack={handleBackToExercises}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WorkoutPlanHeader onBack={onBack} />
      <ExerciseList
        exercises={exercises}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        onCreateExercise={handleCreateExercise}
        onEditExercise={handleEditExercise}
      />
    </div>
  );
} 