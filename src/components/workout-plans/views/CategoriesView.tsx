"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Category } from "../types";
import { WorkoutPlanHeader } from "../WorkoutPlanHeader";
import Loader from "@/components/Loader";

interface CategoriesViewProps {
  onBack: () => void;
}

export function CategoriesView({ onBack }: CategoriesViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "create">("create");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchWrapper("/admin/workout-category/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setModalType("edit");
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowModal(true);
  };

  const handleCreateCategory = () => {
    setModalType("create");
    setEditingCategory(null);
    setCategoryName("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;

    setSubmitting(true);
    try {
      if (modalType === "create") {
        const response = await fetchWrapper("/admin/workout-category/save", {
          method: "POST",
          body: { name: categoryName.trim() },
        });
        if (response.success) {
          toast.success("Category created successfully");
        } else {
          toast.error("Error creating category");
        }
        fetchCategories();
      } else if (modalType === "edit" && editingCategory) {
        const response = await fetchWrapper(
          `/admin/workout-category/update/${editingCategory._id}`,
          {
            method: "PUT",
            body: { name: categoryName.trim() },
          }
        );
        if (response.success) {
          toast.success("Category updated successfully");
          fetchCategories();
        } else {
          toast.error("Error updating category");
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category");
    } finally {
      setSubmitting(false);
      setShowModal(false);
      setCategoryName("");
      setEditingCategory(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <WorkoutPlanHeader onBack={onBack} />

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-[#171616] mb-6">Categories</h2>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg border border-black p-6 relative"
              >
                <button
                  onClick={() => handleEditCategory(category)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
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
                <h3 className="text-base font-medium text-[#171616] text-center">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <div
            onClick={handleCreateCategory}
            className="bg-white rounded-lg border border-black p-6 cursor-pointer hover:shadow-lg transition-all duration-200 w-64"
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">+</span>
              </div>
            </div>
            <h3 className="text-base font-medium text-[#171616] text-center">
              Create New Category
            </h3>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold text-[#171616] mb-6">
              {modalType === "create" ? "Create New Category" : "Edit Category"}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
                placeholder="Enter category name"
                autoFocus
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!categoryName.trim() || submitting}
                className="flex-1 bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (modalType === "create" ? "Creating..." : "Updating...") : (modalType === "create" ? "Create" : "Update")}
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
