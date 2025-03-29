import React from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ResetForm = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitAlbum = async (data) => {
    try {
      const requestData = {
        ...data,
        email,
        token,
      };
      const response = await fetch("http://localhost:8081/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log(response);

      if (response.status === 200) {
        // alert("Password reset successful");
        navigate("/login");
      } else {
        toast.error("Password reset failed");
        console.error("Password reset failed");
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="wrapper">
          <h1 className="font-semibold">Enter new Password</h1>

          <form onSubmit={handleSubmit(submitAlbum)}>
            <div className=" input-box">
              <input
                {...register("newPassword", { required: true })}
                placeholder="New Password"
                type="password"
              />
              <FaLock className="icon" />

              {errors.newPassword && <p>newPassword is required</p>}
            </div>
            <div className=" input-box">
              <input
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm Password"
                type="password"
              />
              <FaLock className="icon" />

              {errors.confirmPassword && <p>confirmPassword is required</p>}
            </div>

            <input
              className="w-full loginbutton cursor-pointer bg-black text-white px-4 py-3 font-bold rounded-full hover:bg-white hover:text-black"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetForm;
