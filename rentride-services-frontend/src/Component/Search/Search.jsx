import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Search = () => {
  const [vehicles, setVehicles] = useState([]);
  const [sortOrder, setSortOrder] = useState("ascending"); // Default sort order
  const { searchStatus } = useSelector((state) => state.search);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm")?.toLowerCase() || "";

  async function fetchVehicles() {
    try {
      const response = await fetch("http://localhost:8081/getVehicle");
      const responseData = await response.json();
      const vehiclesData = responseData.vehicle;
      setVehicles(vehiclesData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  let filteredVehicles = vehicles.filter(
    (vehicle) =>
      (vehicle.model?.toLowerCase().includes(searchTerm) ||
        vehicle.brand?.toLowerCase().includes(searchTerm)) &&
      vehicle.image
  );

  // Sorting vehicles based on price
  const sortPriceAsc = (a, b) => a.price - b.price;
  const sortPriceDesc = (a, b) => b.price - a.price;

  if (sortOrder === "ascending") {
    filteredVehicles.sort(sortPriceAsc);
  } else {
    filteredVehicles.sort(sortPriceDesc);
  }

  return (
    <>
      <Navbar />
      <div>
        <div className="flex V-heading">
          <h1 className="my-2 text-xl font-bold"> SORT: </h1>
          <select
            className="ml-4 bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="ascending">Lower to Higher</option>
            <option value="descending">Higher to Lower</option>
          </select>
        </div>
        <div className="v-main ">
          {filteredVehicles.map((vehicle, index) => (
            <div key={index} className="v-inner flex flex-col gap-4 flex-1">
              {vehicle.image && (
                <div className="v-first">
                  <img
                    src={`http://localhost:8081/uploads/${vehicle.image}`}
                    alt={`Image`}
                  />
                </div>
              )}

              <div className="v-second">
                {vehicle.model && (
                  <h3 className="text-xl font-bold text-center">
                    {vehicle.model}
                  </h3>
                )}
                <br />
                {vehicle.brand && (
                  <p>
                    <b>Brand:</b> {vehicle.brand}
                  </p>
                )}
                {vehicle.type && (
                  <p>
                    <b>Type:</b> {vehicle.type}
                  </p>
                )}
                {vehicle.power && (
                  <p>
                    <b>Power:</b> {vehicle.power}
                  </p>
                )}
                {vehicle.Fuel && (
                  <p>
                    <b>Fuel:</b> {vehicle.Fuel}
                  </p>
                )}
                {vehicle.description && (
                  <p>
                    <b>Description:</b> {vehicle.description}
                  </p>
                )}
                {vehicle.price && (
                  <p>
                    <b>Price:</b> {vehicle.price}
                  </p>
                )}
                {vehicle.availability !== undefined && (
                  <p>
                    <b>Status:</b>{" "}
                    {vehicle.availability ? "Available" : "Not Available"}
                  </p>
                )}
                {vehicle.review && (
                  <ul>
                    <p>
                      <b>Review:</b>
                    </p>
                    {vehicle.review.map((review, index) => (
                      <li key={index}>{review}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
