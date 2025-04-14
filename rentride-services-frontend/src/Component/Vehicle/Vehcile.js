import React, { useEffect, useState } from "react";
import "./Vehicle.css";
import Navbar from "../Navbar/Navbar";
import Booking from "../Booking/Booking";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Review2 from "../Review/Review2";
import { Link } from "react-router-dom";

const Vehicle = () => {
  const user = useSelector((state) => state.user.user);
  const [page, setPage] = useState(1);
  const [review, setReview] = useState(false);
  const [rating, setRating] = useState(0);
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

  const [nextAvailableDates, setNextAvailableDates] = useState({});

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
      const bookings = responseData.Bookings;

      console.log(bookings);

      setReserve(bookings);

      const availabilityMap = {};

      bookings.forEach((booking) => {
        const { vehicleId, checkOutDate } = booking;
        const checkout = new Date(checkOutDate);

        if (
          !availabilityMap[vehicleId] ||
          checkout > new Date(availabilityMap[vehicleId])
        ) {
          availabilityMap[vehicleId] = checkout.toISOString().split("T")[0]; // keep only date part
        }
      });

      setNextAvailableDates(availabilityMap);
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
    setReview(false);
    setBook(false);
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

  // Helper to calculate distance between two coordinates
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2); // returns value in km
  }

  return (
    <>
      <Navbar />
      <div className="V-heading">
        <div>
          <Link
            to="/Vehicle"
            className="mr-3 bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-car"></i>Vehicle
          </Link>
        </div>
        <div>
          <Link
            to="/compare"
            className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-car"></i>Compare
          </Link>
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
          <Review2
            vehicleId={vehicleId}
            onClose={handleCloseBooking}
            rating={rating}
            setRating={setRating}
          />
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
          filteredVehicles.slice(startIndex, endIndex).map((x) => {
            const userLat = user?.rest?.geoLocation?.ll[0];
            const userLng = user?.rest?.geoLocation?.ll[1];
            const vehicleLat = x?.geoLocation?.ll[0];
            const vehicleLng = x?.geoLocation?.ll[1];

            const distance =
              userLat && userLng && vehicleLat && vehicleLng
                ? getDistanceFromLatLonInKm(
                    userLat,
                    userLng,
                    vehicleLat,
                    vehicleLng
                  )
                : null;

            return (
              <div className="v-inner flex flex-col gap-4 flex-1" key={x._id}>
                <div className="v-first">
                  <img
                    src={`http://localhost:8081/uploads/${x.image}`}
                    alt={x.brand}
                  />

                  {!x.availability ? (
                    <div className="flex items-center justify-center my-6">
                      <div className="w-fit bg-yellow-100 text-gray-800 font-medium py-3 px-5 rounded-2xl shadow-lg border border-yellow-300">
                        <span className="mr-1">Available after:</span>
                        <span className="font-semibold text-red-600">
                          {nextAvailableDates[x._id] || "Currently Unavailable"}
                        </span>
                      </div>
                    </div>
                  ) : (
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
                  <div className="text-sm text-gray-700 font-semibold mt-2">
                    {distance ? (
                      <>
                        📍 <span className="font-semibold">{distance} km</span>{" "}
                        away from you
                      </>
                    ) : (
                      "Location not available"
                    )}
                  </div>
                  <br />

                  {reserve?.find((reserve) => reserve.vehicleId === x._id) && (
                    <>
                      <button
                        onClick={() => {
                          handleReview(x._id);
                        }}
                        className=" bg-black mb-2 text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                      >
                        Add Review
                      </button>
                    </>
                  )}

                  {typeof x.ratings !== "undefined" && x.ratings.length > 0 && (
                    <div className="my-2">
                      <b>Rating: </b>
                      <div className="flex">
                        {/* Calculate the average rating */}
                        {(() => {
                          const averageRating =
                            x.ratings.reduce(
                              (sum, rating) => sum + rating.rating,
                              0
                            ) / x.ratings.length;

                          // Round to nearest whole number
                          const roundedRating = Math.round(averageRating);

                          return (
                            <>
                              {[...Array(roundedRating)].map((_, index) => (
                                <svg
                                  key={index}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="yellow"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                              {[...Array(5 - roundedRating)].map((_, index) => (
                                <svg
                                  key={index}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="gray"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </>
                          );
                        })()}

                        <span className="ml-2 text-gray-600">
                          ({x.ratings.length} reviews)
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Customer Reviews:
                    </h4>
                    {x.review && x.review.length > 0 ? (
                      x.review.map((rev, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <span className="text-sm text-gray-600">- {rev}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No reviews yet.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
