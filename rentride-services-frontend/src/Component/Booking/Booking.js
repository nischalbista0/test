import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Khalti from "../Khalti/Khalti";
import { paymentReset } from "../../redux/user/paymentSlice";
import { useNavigate } from "react-router-dom";
import {
  reservationStart,
  reservationReset,
  reservationSuccess,
} from "../../redux/user/reservationSlice";

export default function Booking({ price, model, onClose, id }) {
  const { user } = useSelector((state) => state.user);
  const { reservationStatus } = useSelector((state) => state.reservation);
  const { paymentStatus } = useSelector((state) => state.payment);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [contact, setContact] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [description, setDescription] = useState("");
  const [, setFile] = useState(""); // Image file state, can be used for server-side upload
  const [showPopup, setShowPopup] = useState(true);
  const [khalti, setKhalti] = useState(false);

  const handleKhalti = (e) => {
    e.preventDefault();
    const userData = {
      email: user?.rest.email,
      userName,
      contact,
      checkOutDate,
      price,
      description,
      model,
      image: "",
      vehicleId: id,
    };

    dispatch(reservationStart());
    dispatch(reservationSuccess(userData));
    setKhalti(true);
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      handleConfirmBooking();
    }
  }, [paymentStatus]);

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch("http://localhost:8081/createBooking", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationStatus),
      });
      dispatch(reservationReset());
      dispatch(paymentReset());
      navigate("/Vehicle");

      // Reset all states after successful form submission
      setUserName("");
      setContact("");
      setCheckOutDate("");
      setDescription("");
      setFile("");
      setShowPopup(false);

      onClose();
    } catch (error) {
      console.error("Error adding vehicle booking", error);
    }
  };

  function handleClose() {
    setShowPopup(false);
    onClose();
  }

  return (
    <>
      {showPopup && (
        <div className="fixed z-[999999999999999999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-4xl relative">
            <button
              className="absolute top-0 right-0 px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleClose}
            >
              <i className="fas fa-times" />
            </button>
            <h1 className="text-3xl font-semibold text-center my-9">
              Vehicle Booking
            </h1>
            <p className="text-l font-semibold">Model: {model}</p>
            <p className="text-l font-semibold">Price: Rs.{price}</p>
            <br />
            <form className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border p-3 rounded-lg"
                  maxLength="62"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />

                <input
                  type="Number"
                  placeholder="Contact Number"
                  className="border p-3 rounded-lg "
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
                <label>Check Out:</label>
                <input
                  type="date"
                  className="border p-3 rounded-lg "
                  maxLength="3"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col flex-1 gap-4">
                <textarea
                  placeholder="Description"
                  className="border p-3 rounded-lg "
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                {/* Optional image upload, handle on server if needed */}
                {/* <input
                  type="file"
                  accept="image/*"
                  className="border p-3 rounded-lg "
                  onChange={(e) => setFile(e.target.files[0])}
                /> */}

                <button
                  onClick={handleKhalti}
                  className=" p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                  Pay with Khalti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {khalti && <Khalti amounto={price} purpose={"vehicle"} />}
    </>
  );
}
