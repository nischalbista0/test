import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Review2 = ({ vehicleId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!vehicleId) {
      toast.error("Error: Vehicle ID is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/addReviewV", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: vehicleId,
          review: data.review,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Review submitted successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error(result.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99999]">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            onClick={!loading ? onClose : null}
            disabled={loading}
          >
            ✖
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Add Your Review
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <textarea
              className="border p-3 rounded-lg focus:ring focus:ring-indigo-300"
              rows="4"
              {...register("review", { required: "Review is required" })}
              placeholder="Enter your experience..."
              disabled={loading}
            />
            {errors.review && (
              <p className="text-red-500">{errors.review.message}</p>
            )}

            <button
              type="submit"
              className="p-3 bg-indigo-600 text-white rounded-lg uppercase font-medium hover:bg-indigo-700 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Review2;
