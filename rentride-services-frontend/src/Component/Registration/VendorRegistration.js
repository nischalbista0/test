import React, { useState, useEffect, useRef } from "react";
import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";

function Registration() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false);

  const mapRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const initialCoords = fromLonLat([
      longitude || 85.324,
      latitude || 27.7172,
    ]);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaultControls({ attribution: false }),
      view: new View({
        center: initialCoords,
        zoom: 13,
      }),
    });

    map.on("click", function (evt) {
      const coords = toLonLat(evt.coordinate);
      setLongitude(coords[0]);
      setLatitude(coords[1]);
      setLocationSelected(true);
    });

    if (!locationSelected && latitude === null && longitude === null) {
      setLatitude(27.7172);
      setLongitude(85.324);
      setLocationSelected(true);
    }

    return () => map.setTarget(null);
  }, [latitude, longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!latitude || !longitude) {
      toast.error("Location not selected");
      return;
    }

    const newVendor = {
      userName,
      email,
      password,
      latitude,
      longitude,
    };

    try {
      const response = await fetch("http://localhost:8081/addVendor", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      });

      const data = await response.json();

      console.log(data);

      if (data.message === "Vendor member already exists") {
        toast.error("Vendor member already exists");
        return;
      }

      toast.success("Vendor added successfully!");
      navigate("/login"); // Redirect to login or dashboard
    } catch (error) {
      toast.error("Failed to add vendor.");
      console.error(error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="wrapper">
        <h1 className="font-semibold">Vendor Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              placeholder="Name"
              className="border p-3 rounded-lg"
              type="text"
              value={userName}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              placeholder="Email"
              className="border p-3 rounded-lg"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              placeholder="Password"
              className="border p-3 rounded-lg"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input
              placeholder="Confirm Password"
              className="border p-3 rounded-lg"
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="text-start flex flex-col gap-2">
            <h3>Select your location:</h3>
            <div
              ref={mapRef}
              className="border h-[300px] w-full rounded-md mb-2"
            />
            {!locationSelected && (
              <p className="text-red-500">Please select your location.</p>
            )}
          </div>

          <button className="change" type="submit">
            Register as Vendor
          </button>

          <div className="register-link">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
