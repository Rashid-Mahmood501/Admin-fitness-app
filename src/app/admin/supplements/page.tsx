"use client";

import { fetchWrapper } from "@/utils/fetchwraper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface Supplement {
  _id?: string;
  name: string;
  description: string;
  createdAt?: string;
}

export default function SupplementsPage() {
  const { register, handleSubmit, reset } = useForm<Supplement>();
  const [loading, setLoading] = useState(false);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [fetchingSupplements, setFetchingSupplements] = useState(true);

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const response = await fetchWrapper<any>("/admin/supplement/all", {
        method: "GET",
      });
      console.log(response);
      const supplementsArray = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
        ? response.data
        : response?.supplements && Array.isArray(response.supplements)
        ? response.supplements
        : [];

      const sortedSupplements = supplementsArray.sort(
        (a: Supplement, b: Supplement) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );

      setSupplements(sortedSupplements);
    } catch (error) {
      toast.error("Failed to fetch supplements");
      console.error("Error fetching supplements:", error);
      setSupplements([]);
    } finally {
      setFetchingSupplements(false);
    }
  };

  const onSubmit = async (data: Supplement) => {
    setLoading(true);
    try {
      const response = await fetchWrapper("/admin/supplement/create", {
        method: "POST",
        body: data,
      });
      if (!response) {
        throw new Error("Failed to add supplement");
      }
      toast.success("Supplement added successfully!");
      reset();
      await fetchSupplements();
    } catch (err: any) {
      toast.error("Failed to add supplement");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <span className="text-3xl">💊</span>
        <h1 className="text-3xl font-bold text-[#171616]">Supplements</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          Add New Supplement
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Supplement Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors"
              placeholder="Enter supplement name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 border text-gray-700 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC1D13] focus:border-[#EC1D13] outline-none transition-colors resize-vertical"
              placeholder="Enter supplement description..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EC1D13] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#d41910] transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? "Adding..." : "Add Supplement"}
          </button>
        </form>
      </div>

      {/* Supplements Table */}
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-[#171616] mb-6">
          All Supplements
        </h2>

        {fetchingSupplements ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC1D13]"></div>
          </div>
        ) : supplements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No supplements found. Add your first supplement above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-gray-900 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(supplements) &&
                  supplements.map((supplement, index) => (
                    <tr
                      key={supplement._id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {supplement.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {supplement.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {supplement.createdAt
                          ? new Date(supplement.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
