"use client";

import Loader from "@/components/Loader";
import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { WorkoutPlanHeader } from "../../WorkoutPlanHeader";
import { Exercise, ExerciseForm } from "../../types";
import { CreateExerciseForm } from "./CreateExerciseForm";
import { ExerciseList } from "./ExerciseList";

export function ExercisesView({ onBack }: { onBack: () => void }) {
  const [showCreateExerciseForm, setShowCreateExerciseForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("Chest");
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(
    undefined
  );

  const handleCreateExercise = () => {
    setShowCreateExerciseForm(true);
    setIsEditMode(false);
    setEditingExerciseId("");
  };

  // Helper to find exercise by id recursively (top-level and alternatives)
  const findExerciseById = (
    id: string,
    exercises: Exercise[]
  ): Exercise | undefined => {
    for (const ex of exercises) {
      if (ex._id === id) return ex;
      if (ex.alternatives && ex.alternatives.length > 0) {
        const found = findExerciseById(id, ex.alternatives);
        if (found) return found;
      }
    }
    return undefined;
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = findExerciseById(exerciseId, exercises);
    if (exercise) {
      setIsEditMode(true);
      setEditingExercise(exercise);
      setEditingExerciseId(exerciseId);
      setShowCreateExerciseForm(true);
    }
  };

  const fetchExercises = async () => {
    try {
      setInitialLoading(true);
      const response = await fetchWrapper("/admin/workout/all");
      setExercises(response.workouts);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBackToExercises = () => {
    setShowCreateExerciseForm(false);
    setIsEditMode(false);
    setEditingExerciseId("");
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleFormSubmit = async (
    formData: ExerciseForm & { selectedCategory: string }
  ) => {
    if (isEditMode) {
      if (!editingExerciseId) return;
      setLoading(true);
      const formDataToSave = new FormData();
      formDataToSave.append("name", formData.workoutName);
      formDataToSave.append("muscleGroup", formData.muscleGroup);
      formDataToSave.append("setType", formData.setType);
      formDataToSave.append("reps", formData.reps);
      formDataToSave.append("comments", formData.additionalComments);
      formDataToSave.append("suggestion", formData.workoutSuggestion);
      if (formData.video) {
        formDataToSave.append("video", formData.video as unknown as File);
      }

      try {
        const response = await fetchWrapper(
          `/admin/workout/update/${editingExerciseId}`,
          {
            method: "PUT",
            body: formDataToSave,
            isFormData: true,
          }
        );

        if (
          response.success ||
          response.message === "Meal plan saved successfully"
        ) {
          toast.success("Meal Plan Saved");
          fetchExercises();
        } else {
          toast.error("Failed to save meal plan");
        }
      } catch (error) {
        console.error("Error submitting meal plan:", error);
        toast.error("Error submitting meal plan");
      } finally {
        setLoading(false);
        handleBackToExercises();
      }
    } else {
      setLoading(true);
      try {
        const response = await fetchWrapper("/admin/workout/save", {
          method: "POST",
          body: formData,
        });
        if (
          response.success ||
          response.message === "Meal plan saved successfully"
        ) {
          toast.success("Meal Plan Saved");
          fetchExercises();
        } else {
          toast.error("Failed to save meal plan");
        }
      } catch (error) {
        console.error("Error submitting meal plan:", error);
        toast.error("Error submitting meal plan");
      } finally {
        setLoading(false);
        handleBackToExercises();
      }
    }
  };

  if (showCreateExerciseForm) {
    return (
      <CreateExerciseForm
        isEditMode={isEditMode}
        editingExercise={isEditMode ? editingExercise : undefined}
        onSubmit={handleFormSubmit}
        onBack={handleBackToExercises}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WorkoutPlanHeader onBack={onBack} />
      {initialLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <ExerciseList
          exercises={exercises}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          onCreateExercise={handleCreateExercise}
          onEditExercise={handleEditExercise}
        />
      )}
      <Toaster />
    </div>
  );
}
