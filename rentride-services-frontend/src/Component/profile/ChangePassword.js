import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./ChangePassword.css";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Separate state variables for each password field
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (passwordType) => {
    switch (passwordType) {
      case "old":
        setShowOldPassword(!showOldPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const submitAlbum = async (data) => {
    try {
      const requestData = {
        ...data,
        email: user.rest.email,
      };
      const response = await fetch("http://localhost:8081/changePassword", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="main-wrapper1">
        <div className="wrapper2">
          <h1 className="font-semibold">Change Password</h1>

          <form onSubmit={handleSubmit(submitAlbum)}>
            <div className="input-box">
              <input
                {...register("oldPassword", { required: true })}
                placeholder="Old Password"
                type={showOldPassword ? "text" : "password"}
              />
              <button
                className="icon"
                type="button"
                onClick={() => togglePasswordVisibility("old")}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.oldPassword && <p>Old Password is required</p>}
            </div>

            <div className="input-box">
              <input
                {...register("newPassword", { required: true })}
                placeholder="New Password"
                type={showNewPassword ? "text" : "password"}
              />
              <button
                className="icon"
                type="button"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>
              {errors.newPassword && <p>New Password is required</p>}
            </div>
            <div className="input-box">
              <input
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                className="icon"
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              </button>
              {errors.confirmPassword && <p>Confirm Password is required</p>}
            </div>

            <input className="change" type="submit" value="Change Password" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
