import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  payementFailure,
  paymentStart,
  paymentSuccess,
} from "../../redux/user/paymentSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const purpose = searchParams.get("purchase_order_name");
  useEffect(() => {
    const submitAlbum = async () => {
      try {
        dispatch(paymentStart());
        const pidx = searchParams.get("pidx");
        const requestData = { pidx: pidx }; // Create object with pidx
        const response = await fetch("http://localhost:8081/khaltiSuccess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData), // Stringify the object
        });

        const responseData = await response.json(); // Parse response JSON

        if (responseData.status === "Completed") {
          dispatch(paymentSuccess());
          toast.success("Payment has been received.", {
            position: "top-right",
          });
          if (purpose === "vehicle") {
            navigate("/Booking");
          }
        } else {
          dispatch(payementFailure());
        }
      } catch (error) {
        dispatch(payementFailure());
        console.error(error);
      }
    };

    submitAlbum(); // Call the function once
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-700">Processing your payment...</p>
        </div>
      </div>
    </div>
  );
};

export default Success;
