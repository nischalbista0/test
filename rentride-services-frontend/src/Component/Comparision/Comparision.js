import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";

const Comparision = () => {
  const user = useSelector((state) => state.user.user);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState(null);
  const [vehicle2, setVehicle2] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8081/getVehicle");
        const responseData = await response.json();
        const filteredVehicles = responseData.vehicle.filter(
          (v) => v.availability === true
        );
        setVehicles(filteredVehicles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehicles();
  }, []);

  const handleVehicleChange = (event, setVehicle) => {
    const selected = vehicles.find((v) => v.model === event.target.value);
    setVehicle(selected);
  };

  const getAverageRating = (ratings) =>
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  const avgRating1 = getAverageRating(vehicle1?.ratings || []);
  const avgRating2 = getAverageRating(vehicle2?.ratings || []);

  const highlight1 = avgRating1 > avgRating2;
  const highlight2 = avgRating2 > avgRating1;

  const renderStars = (average, count) => {
    const rounded = Math.round(average);
    return (
      <>
        {[...Array(rounded)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="yellow"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        {[...Array(5 - rounded)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="gray"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">({count} reviews)</span>
      </>
    );
  };

  const renderVehicleCard = (vehicle, highlight) => {
    if (!vehicle) return null;

    const average = getAverageRating(vehicle.ratings || []);

    // Distance calculation
    const userLat = user?.rest?.geoLocation?.ll[0];
    const userLng = user?.rest?.geoLocation?.ll[1];
    const vehicleLat = vehicle?.geoLocation?.ll?.[0];
    const vehicleLng = vehicle?.geoLocation?.ll?.[1];

    const distance =
      userLat && userLng && vehicleLat && vehicleLng
        ? getDistanceFromLatLonInKm(userLat, userLng, vehicleLat, vehicleLng)
        : null;

    console.log(distance);

    return (
      <div
        className={`v-inner ${
          highlight ? "border-4 border-green-500 rounded-xl" : ""
        }`}
      >
        <div className="v-first">
          <img
            src={`http://localhost:8081/uploads/${vehicle.image}`}
            alt={vehicle.brand}
          />
        </div>
        <div className="v-second">
          <h3 className="text-xl font-bold text-center">{vehicle.model}</h3>
          <p>
            <b>Brand:</b> {vehicle.brand}
          </p>
          <p>
            <b>Type:</b> {vehicle.type}
          </p>
          <p>
            <b>Power:</b> {vehicle.power}
          </p>
          <p>
            <b>Fuel:</b> {vehicle.Fuel}
          </p>
          <p>
            <b>Price/Per day:</b> Rs. {vehicle.price}
          </p>

          {/* Distance Display */}
          <div className="text-sm text-gray-700 font-semibold mt-2">
            {distance ? (
              <>
                📍 <span className="font-semibold">{distance} km</span> away
                from you
              </>
            ) : (
              <>📍Please login to view distance</>
            )}
          </div>

          {vehicle.ratings?.length > 0 && (
            <div className="my-2">
              <b>Rating:</b>
              <div className="flex">
                {renderStars(average, vehicle.ratings.length)}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mt-2">
              Customer Reviews:
            </h4>
            {vehicle.review && vehicle.review.length > 0 ? (
              vehicle.review.map((rev, i) => (
                <div key={i} className="flex items-center mb-2">
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
  };

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
      <div className="V-heading flex gap-4">
        <a
          href="/Vehicle"
          className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl"
        >
          <i className="fas fa-car"></i> Vehicle
        </a>
        <a
          href="/compare"
          className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl"
        >
          <i className="fas fa-car"></i> Compare
        </a>
      </div>

      <div className="border border-black rounded-lg p-3 max-w-7xl mx-auto my-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <label className="font-semibold text-center">
              Choose First Vehicle:
            </label>
            <select
              className="border p-3 rounded-lg"
              onChange={(e) => handleVehicleChange(e, setVehicle1)}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((v, i) => (
                <option key={i} value={v.model}>
                  {v.model}
                </option>
              ))}
            </select>
            {renderVehicleCard(vehicle1, highlight1)}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <label className="font-semibold text-center">
              Choose Second Vehicle:
            </label>
            <select
              className="border p-3 rounded-lg"
              onChange={(e) => handleVehicleChange(e, setVehicle2)}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((v, i) => (
                <option key={i} value={v.model}>
                  {v.model}
                </option>
              ))}
            </select>
            {renderVehicleCard(vehicle2, highlight2)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Comparision;
