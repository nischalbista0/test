import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import { useSelector } from "react-redux";

export default function Admin_Booking() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchModel, setSearchModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  async function fetchVehicle() {
    try {
      const response = await fetch("http://localhost:8081/getVehicle");
      const responseData = await response.json();
      const vehicles = responseData.vehicle;
      // const filteredVehicles = vehicles.filter(
      //   (vehicle) => vehicle.availability === true
      // );
      setVehicles(vehicles);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchBookings() {
    try {
      const response = await fetch("http://localhost:8081/fetchBookingadmin", {
        credentials: "include",
      });
      const responseData = await response.json();
      const allBookings = responseData.Bookings;

      // Match only bookings for vehicles owned by the current vendor
      const vendorVehicleIds = vehicles
        .filter((vehicle) => vehicle.userId === user.rest._id)
        .map((vehicle) => vehicle._id); // get IDs of owned vehicles

      const vendorBookings = allBookings.filter((booking) =>
        vendorVehicleIds.includes(booking.vehicleId)
      );

      setBookings(vendorBookings); // Save filtered list for further filtering
      setFilteredVehicles(vendorBookings); // Initially show all
    } catch (error) {
      toast.error("You are not admin", { position: "top-right" });
      navigate("/");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchVehicle(); // Fetch vehicles first
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      fetchBookings(); // Only fetch bookings after vehicles are loaded
    }
  }, [vehicles]);

  // Filtering logic
  useEffect(() => {
    let filtered = bookings;

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
  }, [searchModel, minPrice, maxPrice, checkoutDate, bookings]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
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
                <th className="p-4">Status</th>
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
                    <td className="p-4">
                      {vehicle.status === "cancelled" ? (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          Confirmed
                        </span>
                      )}
                    </td>
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
