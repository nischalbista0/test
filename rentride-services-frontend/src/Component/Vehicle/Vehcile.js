import React, { useEffect, useState } from "react";
import "./Vehicle.css";
import Navbar from "../Navbar/Navbar";
import Booking from "../Booking/Booking";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Review2 from "../Review/Review2";

const Vehicle = () => {
  const user = useSelector((state) => state.user.user);
  const [page, setPage] = useState(1);
  const [review, setReview] = useState(false);
  const [reserve, setReserve] = useState();

  const [vehicle, setVehicle] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [vehicleId, setVehicleId] = useState(null);
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [id, setId] = useState("");
  const [book, setBook] = useState(false);

  const [brandFilter, setBrandFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const handleNextPage = () => {
    if (hasNextPage) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) setPage(page - 1);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    if (vehicleId !== null) {
      setReview(true);
    }
  }, [vehicleId]);

  async function fetchVehicle() {
    try {
      const response = await fetch("http://localhost:8081/getVehicle");
      const responseData = await response.json();
      const vehicles = responseData.vehicle;
      // const filteredVehicles = vehicles.filter(
      //   (vehicle) => vehicle.availability === true
      // );
      setVehicle(vehicles);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchBookings() {
    try {
      const response = await fetch("http://localhost:8081/fetchBooking", {
        credentials: "include",
      });
      const responseData = await response.json();
      setReserve(responseData.Bookings);
    } catch (error) {
      console.error(error);
    }
  }
  const prevReserve = reserve?.filter(
    (reserve) => reserve.email === user?.rest?.email
  );

  const handleReview = (vehicleId) => {
    if (review && vehicleId === vehicleId) {
      // If review is already open for the same vehicle, close it
      setReview(false);
    } else {
      let hasReviewForVehicle = false;
      prevReserve.forEach((reserve) => {
        if (reserve.vehicleId === vehicleId) {
          hasReviewForVehicle = true;
          return;
        }
      });

      if (!user) {
        toast.error("Please login to add review", {
          position: "top-right",
        });
        return;
      }

      setVehicleId(vehicleId);
      setReview(true);
    }
  };

  useEffect(() => {
    fetchVehicle();
    fetchBookings();
  }, []);

  // Function to handle closing of the Booking or Review component
  function handleCloseBooking() {
    setReview(false); // Reset review state to false
    setBook(false); // Reset book state to false
  }

  // Filtering logic
  useEffect(() => {
    let filtered = vehicle;

    if (brandFilter) {
      filtered = filtered.filter((v) =>
        v.brand.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }
    if (fuelFilter) {
      filtered = filtered.filter(
        (v) => v.Fuel.toLowerCase() === fuelFilter.toLowerCase()
      );
    }
    if (minPrice) {
      filtered = filtered.filter((v) => v.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((v) => v.price <= Number(maxPrice));
    }
    if (availabilityFilter) {
      filtered = filtered.filter((v) => v.availability);
    }

    setFilteredVehicles(filtered);
    setPage(1);
  }, [
    brandFilter,
    fuelFilter,
    minPrice,
    maxPrice,
    availabilityFilter,
    vehicle,
  ]);

  return (
    <>
      <Navbar />
      <div className="V-heading">
        <div>
          <a
            href="/Vehicle"
            className="mr-3 bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-car"></i>Vehicle
          </a>
        </div>
        <div>
          <a
            href="/compare"
            className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-car"></i>Compare
          </a>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white shadow-md p-4 rounded-lg my-6 mx-auto max-w-5xl flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Brand..."
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border px-4 py-2 rounded-md w-48 focus:ring focus:ring-blue-300"
        />
        <select
          value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)}
          className="border px-4 py-2 rounded-md w-48 focus:ring focus:ring-blue-300"
        >
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-4 py-2 rounded-md w-32 focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-4 py-2 rounded-md w-32 focus:ring focus:ring-blue-300"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.checked)}
            className="w-5 h-5"
          />
          <span>Available Only</span>
        </label>
        <button
          onClick={() => {
            setBrandFilter("");
            setFuelFilter("");
            setMinPrice("");
            setMaxPrice("");
            setAvailabilityFilter("");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Clear Filters
        </button>
      </div>
      <div className="v-main ">
        {review && (
          <Review2 vehicleId={vehicleId} onClose={handleCloseBooking} />
        )}
        {book &&
          (user ? (
            <Booking
              price={price}
              model={model}
              id={id}
              onClose={handleCloseBooking}
            />
          ) : (
            <Navigate to="/login" />
          ))}
        {filteredVehicles.length ? (
          filteredVehicles.slice(startIndex, endIndex).map((x) => (
            <div className="v-inner flex flex-col gap-4 flex-1" key={x._id}>
              <div className="v-first">
                <img
                  src={`http://localhost:8081/uploads/${x.image}`}
                  alt={x.brand}
                />

                {x.availability ? (
                  <div className="text-center my-6">
                    <button
                      onClick={() => {
                        setBook(true);
                        setPrice(x.price);
                        setModel(x.model);
                        setId(x._id);
                      }}
                      className="bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl "
                    >
                      Book Now
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center my-6">
                    <div className="w-fit text-white font-bold bg-red-400 py-1 px-2 rounded-xl">
                      Not Available
                    </div>
                  </div>
                )}
              </div>
              <div className="v-second">
                <h3 className="text-xl font-bold text-center">{x.model}</h3>
                <br />

                <p>
                  <b>Brand: </b>
                  {x.brand}
                </p>

                <p>
                  <b>Type: </b> {x.type}
                </p>

                <p>
                  <b>Power: </b> {x.power}
                </p>

                <p>
                  <b>Fuel: </b> {x.Fuel}
                </p>
                <p>
                  <b>Price/Per day: RS </b> {x.price}
                </p>
                <p>
                  <b>Description: </b> {x.description}
                </p>
                <p>
                  <b>Status: </b>{" "}
                  {x.availability ? "Available" : "Not Available"}
                </p>
                <br />

                <button
                  onClick={() => {
                    handleReview(x._id);
                  }}
                  className=" bg-black text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                >
                  Review
                </button>
                <br />
                <br />
                <div>
                  <b>Review: </b>
                  <ul>
                    {x.review.map((s, index) => (
                      <li key={index}> • {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="w-full col-span-2 font-bold text-black text-center text-lg">
            No vehicle found
          </p>
        )}
      </div>
      <div className="flex justify-center my-4 gap-2">
        <button
          onClick={handlePrevPage}
          disabled={!hasPrevPage}
          className={`size-[45px] flex justify-center items-center rounded-full transition-all duration-300 
      ${
        hasPrevPage
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
        >
          <FaArrowLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`size-[45px] flex justify-center items-center rounded-full transition-all duration-300 font-medium shadow-md 
        ${
          page === index + 1
            ? "bg-blue-600 text-white shadow-lg scale-105"
            : "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className={`size-[45px] flex justify-center items-center rounded-full transition-all duration-300 
      ${
        hasNextPage
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  );
};
export default Vehicle;
