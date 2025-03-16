import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Admin_Booking() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  async function fetchBookings() {
    try {
      const response = await fetch("http://localhost:8081/fetchBookingadmin", {
        credentials: "include",
      });
      const responseData = await response.json();
      console.log(responseData);
      setVehicles(responseData.Bookings);
    } catch (error) {
      toast.error("You are not admin", {
        position: "top-right",
      });
      navigate("/");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <AdminNav />
      <div className="V-heading font-bold text-xxl ">Vehicle Booking list</div>
      <table className="w-full my-12 p-6">
        <thead>
          <tr className="shadow-lg border-black border-4 rounded-xxl  ">
            <th>checkOutDate</th>
            <th>Contact</th>
            <th>Description</th>
            <th>email</th>
            <th>model</th>
            <th>Price/Per day</th>
            <th>userName</th>
            <th>vehicleId</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <tr
                className="shadow-lg text-center border-black border-1 rounded-xxl"
                key={index}
              >
                <td>{vehicle.checkOutDate}</td>
                <td>{vehicle.contact}</td>
                <td>{vehicle.description}</td>
                <td>{vehicle.email}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.price}</td>
                <td>{vehicle.userName}</td>
                <td>{vehicle.vehicleId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
