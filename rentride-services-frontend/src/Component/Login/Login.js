import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { toast } from "react-toastify";

function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      dispatch(signInStart());

      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      setMessage(data.message);

      if (!response.ok) {
        toast.error("Login error", {
          position: "top-right",
        });
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      toast.success("LoggedIn Successful", {
        position: "top-right",
      });

      if (data.role === "admin") {
        navigate("/AdminBooking");
      } else if (data.role === "vendor") {
        navigate("/VendorBooking");
      } else {
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="main-wrapper">
      <div className="wrapper">
        <h1 className="font-semibold">Login</h1>
        <h2>{message}</h2>
        <form onSubmit={handleSubmit}>
          <div className=" input-box">
            <input
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button className="change" type="submit">
            Login
          </button>

          <div className="register-link">
            <a className="cursor-pointer" onClick={() => navigate("/forgotP")}>
              Forgot Password?
            </a>
            <p>
              Don't have an account?
              <a href="/registration"> Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
