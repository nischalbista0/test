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
  const [vehicleId, setVehicleId] = useState(null);
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [id, setId] = useState("");
  const [book, setBook] = useState(false);
  const itemsPerPage = 2;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const hasNextPage = vehicle.length > endIndex;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
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
        console.log(reserve.vehicleId);
        console.log(vehicleId);
        if (reserve.vehicleId === vehicleId) {
          hasReviewForVehicle = true;
          return;
        }
      });

      console.log(hasReviewForVehicle);

      if (!user) {
        toast.error("Please login to add review", {
          position: "top-right",
        });
        return;
      }

      // if (hasReviewForVehicle) {
      //   setVehicleId(vehicleId);
      //   setReview(true);
      // }
      setVehicleId(vehicleId);
      setReview(true);
      // else {
      //   toast.error("Please book to add review", {
      //     position: "top-right",
      //   });
      // }
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
        {vehicle ? (
          vehicle.slice(startIndex, endIndex).map((x) => (
            <div className="v-inner flex flex-col gap-4 flex-1" key={x._id}>
              <div className="v-first">
                <img
                  src={`http://localhost:8081/uploads/${x.image}`}
                  alt={x.brand}
                />

                {x.availability && (
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
          <p className="font-bold text-white">No vehicle found</p>
        )}
      </div>
      <div className="flex justify-center my-4 mx-4">
        <button
          className="bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-l "
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FaArrowLeft />
        </button>
        <button
          className="bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-l "
          onClick={handleNextPage}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  );
};
export default Vehicle;
