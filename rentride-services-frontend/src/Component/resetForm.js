import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

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

      console.log(response, "res");

      if (response.message !== null) {
        console.log("Password reset successful");
        alert("Password reset successful");
        navigate("/login");
      } else {
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

            <input className="loginbutton" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetForm;
