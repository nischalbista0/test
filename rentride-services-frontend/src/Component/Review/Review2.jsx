import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Review2 = ({ vehicleId, onClose, rating, setRating }) => {
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

    if (rating < 1 || rating > 5) {
      toast.error("Please provide a rating between 1 and 5.");
      return;
    }

    setLoading(true);

    try {
      // Sending both review and rating in one request
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
        // Update the rating after review submission
        const ratingResponse = await fetch("http://localhost:8081/addRating", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicleId: vehicleId,
            rating: rating,
          }),
        });

        const ratingResult = await ratingResponse.json();

        if (ratingResponse.ok) {
          toast.success("Review and rating submitted successfully!");
          window.location.reload();
        } else {
          toast.error(ratingResult.message || "Failed to submit rating.");
        }
      } else {
        toast.error(result.message || "Failed to submit review.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (index) => {
    setRating(index + 1);
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
            Add Your Rating and Review
          </h2>

          {/* Rating Section */}
          <div className="mb-4">
            <div className="flex justify-center">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  onClick={() => handleClick(index)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={index < rating ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Review Section */}
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
