import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitAlbum = async (data) => {
    try {
      const response = await fetch("http://localhost:8081/passwordReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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
                {...register("email", { required: true })}
                placeholder="Email"
                type="email"
              />
              <FaLock className="icon" />

              {errors.email && <p>email is required</p>}
            </div>

            <input className="change" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
