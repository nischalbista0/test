import React, { useState } from "react";
import { useForm } from "react-hook-form";
const Review = ({  onClose }) => {
  const [showPopup, setShowPopup] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  function handleClose() {
    setShowPopup(false);
    onClose();
  }

  return (
    <div className="">
      <div className="bg-white p-8 rounded-lg  relative">
        <button
          className="absolute top-0 right-0 px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
        >
          <i className="fas fa-times" />
        </button>
        <form
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex  gap-4 flex-1">
            <textarea
              className="border w-60 h-20 p-3 rounded-lg "
              rows="4"
              cols="50"
              {...register("review", { required: true })}
              placeholder="Enter your experience"
              name="review"
            />
            {errors.review && <p>Review is required</p>}
            <div>
            <input
              className=" p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
              type="submit"
              value="Submit"
            />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
