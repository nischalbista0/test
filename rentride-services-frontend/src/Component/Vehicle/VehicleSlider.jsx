import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // For Next and Prev buttons

const VehicleSlider = () => {
  const [vehicles, setVehicles] = useState([]);
  const sliderRef = useRef(null); // Create a reference to the slider

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("http://localhost:8081/getVehicle");
        const responseData = await response.json();
        setVehicles(responseData.vehicle);
      } catch (error) {
        console.error(error);
      }
    }

    fetchVehicles();
  }, []);

  // Slick settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    autoplay: true,
    autoplaySpeed: 3000,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Function to go to previous slide
  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); // Trigger the previous slide action
    }
  };

  // Function to go to next slide
  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Trigger the next slide action
    }
  };

  return (
    <section className="vehicle-slider overflow-x-hidden my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Vehicles</h2>

      <div className="relative">
        <div
          onClick={handlePrevClick}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-blue-500 p-2 rounded-full cursor-pointer transition-all hover:bg-blue-600"
        >
          <FaArrowLeft className="text-white text-xl" />
        </div>

        <div
          onClick={handleNextClick}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-blue-500 p-2 rounded-full cursor-pointer transition-all hover:bg-blue-600"
        >
          <FaArrowRight className="text-white text-xl" />
        </div>

        <Slider ref={sliderRef} {...settings}>
          {vehicles.slice(0, 5).map((vehicle) => (
            <div key={vehicle._id} className="p-6 bg-white rounded-lg mb-6">
              <img
                src={`http://localhost:8081/uploads/${vehicle.image}`}
                alt={vehicle.model}
                className="w-full h-64 object-cover rounded-md mb-4"
              />

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {vehicle.model}
                  </h3>
                  <p className="text-lg text-gray-600">{vehicle.brand}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Type:</span>
                    <span>{vehicle.type}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Power:</span>
                    <span>{vehicle.power}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Fuel:</span>
                    <span>{vehicle.Fuel}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Description:</span>
                    <span>{vehicle.description}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Price:</span>
                    <span className="font-bold text-xl text-black">
                      Rs {vehicle.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Availability:</span>

                    {vehicle.availability ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-3xl text-sm">
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-3xl text-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Customer Reviews:
                  </h4>
                  {vehicle.review && vehicle.review.length > 0 ? (
                    vehicle.review.map((rev, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <span className="text-sm text-gray-600">{rev}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-center mt-12">
        <Link
          to="/Vehicle"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-[50px] hover:bg-blue-700 transition"
        >
          View All Vehicles
        </Link>
      </div>
    </section>
  );
};

export default VehicleSlider;
