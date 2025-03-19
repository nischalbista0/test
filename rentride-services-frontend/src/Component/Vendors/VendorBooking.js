import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VendorNav from "./VendorNav";

export default function VendorBooking() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  async function fetchBookings() {
    try {
      const response = await fetch("http://localhost:8081/fetchBookingadmin", {
        credentials: "include",
      });
      const responseData = await response.json();
      setVehicles(responseData.Bookings);
    } catch (error) {
      toast.error("You are not admin", { position: "top-right" });
      navigate("/");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-[calc(100vh-170px)] bg-gray-100">
      <VendorNav />
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mt-[90px] mb-6">
          Vehicle Booking List
        </h1>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-blue-500 text-white text-left text-sm md:text-base font-semibold">
                <th className="p-4">Checkout Date</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Description</th>
                <th className="p-4">Email</th>
                <th className="p-4">Model</th>
                <th className="p-4">Price/Day</th>
                <th className="p-4">User</th>
                <th className="p-4">Vehicle ID</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition-all text-gray-700 text-sm md:text-base"
                  >
                    <td className="p-4">
                      {new Date(vehicle.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{vehicle.contact}</td>
                    <td className="p-4">{vehicle.description}</td>
                    <td className="p-4">{vehicle.email}</td>
                    <td className="p-4">{vehicle.model}</td>
                    <td className="p-4 font-bold text-green-600">
                      Rs. {vehicle.price}
                    </td>
                    <td className="p-4">{vehicle.userName}</td>
                    <td className="p-4">{vehicle.vehicleId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-500 italic"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
