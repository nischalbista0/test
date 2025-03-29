import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VendorNav from "./VendorNav";

export default function VendorBooking() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchModel, setSearchModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");

  async function fetchBookings() {
    try {
      const response = await fetch("http://localhost:8081/fetchBookingadmin", {
        credentials: "include",
      });
      const responseData = await response.json();
      setVehicles(responseData.Bookings);
      setFilteredVehicles(responseData.Bookings);
    } catch (error) {
      toast.error("You are not admin", { position: "top-right" });
      navigate("/");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = vehicles;

    if (searchModel) {
      filtered = filtered.filter((v) =>
        v.model.toLowerCase().includes(searchModel.toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter((v) => v.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((v) => v.price <= Number(maxPrice));
    }
    if (checkoutDate) {
      filtered = filtered.filter(
        (v) =>
          new Date(v.checkOutDate).toLocaleDateString() ===
          new Date(checkoutDate).toLocaleDateString()
      );
    }

    setFilteredVehicles(filtered);
  }, [searchModel, minPrice, maxPrice, checkoutDate, vehicles]);

  return (
    <div className="min-h-screen bg-gray-100">
      <VendorNav />
      <div className="px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mt-[90px] mb-6 text-center">
          Vehicle Booking List
        </h1>

        {/* Filter Options */}
        <div className="bg-white w-fit mx-auto shadow-md p-6 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Search by Model..."
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            className="border px-4 py-2 rounded-md w-48 md:w-56 focus:ring focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-4 py-2 rounded-md w-32 md:w-40 focus:ring focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-4 py-2 rounded-md w-32 md:w-40 focus:ring focus:ring-blue-300"
          />

          <input
            type="date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
            className="border px-4 py-2 rounded-md w-48 md:w-56 focus:ring focus:ring-blue-300"
          />

          <button
            onClick={() => {
              setSearchModel("");
              setMinPrice("");
              setMaxPrice("");
              setCheckoutDate("");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition focus:ring focus:ring-red-300"
          >
            Clear Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead className="bg-blue-500 text-white text-left text-sm md:text-base font-semibold sticky top-0 z-10">
              <tr>
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
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={index}
                    className={`border-b text-gray-700 text-sm md:text-base ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-200 transition-all`}
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
