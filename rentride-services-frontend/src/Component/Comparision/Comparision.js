import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import Navbar from "../Navbar/Navbar";

const Comparision = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState(null);
  const [vehicle2, setVehicle2] = useState(null);

  const {
    formState: { errors },
  } = useForm();

  async function fetchVehicles() {
    try {
      const response = await fetch("http://localhost:8081/getVehicle");
      const responseData = await response.json();
      const filteredVehicles = responseData.vehicle.filter(
        (x) => x.availability === true
      );
      setVehicles(filteredVehicles);
      if (vehicles.length > 0) {
        setVehicle1(vehicles[0]); // Set the first vehicle as default for vehicle1
        setVehicle2(vehicles[0]); // Set the first vehicle as default for vehicle2
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicle1Change = (event) => {
    const selectedVehicle = vehicles.find(
      (v) => v.model === event.target.value
    );
    setVehicle1(selectedVehicle);
  };

  const handleVehicle2Change = (event) => {
    const selectedVehicle = vehicles.find(
      (v) => v.model === event.target.value
    );
    setVehicle2(selectedVehicle);
  };

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
      <div className="border border-black  rounded-lg p-3 max-w-7xl mx-auto my-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <label className="font-semibold text-center">
              Choose First Vehicle:{" "}
            </label>
            <select
              className="border p-3 rounded-lg "
              onChange={handleVehicle1Change}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((vec, index) => (
                <option key={index} value={vec.model}>
                  {vec.model}
                </option>
              ))}
            </select>
            {errors.vehicle1 && <p>Vehicle 1 is required</p>}

            {vehicle1 && (
              <div className="v-inner">
                <div className="v-first">
                  <img src={vehicle1.image} alt={vehicle1.brand} />
                </div>
                <div className="v-second">
                  <h3 className="text-xl font-bold text-center">
                    {vehicle1.model}
                  </h3>
                  <br />
                  <p>
                    <b>Brand: </b>
                    {vehicle1.brand}
                  </p>
                  <p>
                    <b>Type: </b>
                    {vehicle1.type}
                  </p>
                  <p>
                    <b>Power: </b>
                    {vehicle1.power}
                  </p>
                  <p>
                    <b>Fuel: </b>
                    {vehicle1.Fuel}
                  </p>
                  <p>
                    <b>Price/Per day: </b>
                    {vehicle1.price}
                  </p>
                  <p>
                    <b>Description: </b>
                    {vehicle1.description}
                  </p>
                  <div>
                    <b>Review: </b>
                    <ul>
                      {vehicle1.review.map((s, index) => (
                        <li key={index}> • {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <label className="font-semibold text-center">
              Choose Second Vehicle:{" "}
            </label>
            <select
              className="border p-3 rounded-lg "
              onChange={handleVehicle2Change}
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((vec, index) => (
                <option key={index} value={vec.model}>
                  {vec.model}
                </option>
              ))}
            </select>
            {errors.vehicle2 && <p>Vehicle 2 is required</p>}

            {vehicle2 && (
              <div className="v-inner">
                <div className="v-first">
                  <img src={vehicle2.image} alt={vehicle2.brand} />
                </div>
                <div className="v-second">
                  <h3 className="text-xl font-bold text-center">
                    {vehicle2.model}
                  </h3>
                  <br />
                  <p>
                    <b>Brand: </b>
                    {vehicle2.brand}
                  </p>
                  <p>
                    <b>Type: </b>
                    {vehicle2.type}
                  </p>
                  <p>
                    <b>Power: </b>
                    {vehicle2.power}
                  </p>
                  <p>
                    <b>Fuel: </b>
                    {vehicle2.Fuel}
                  </p>
                  <p>
                    <b>Price/Per day: </b>
                    {vehicle2.price}
                  </p>
                  <p>
                    <b>Description: </b>
                    {vehicle2.description}
                  </p>
                  <div>
                    <b>Review: </b>
                    <ul>
                      {vehicle1.review.map((s, index) => (
                        <li key={index}> • {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Comparision;
