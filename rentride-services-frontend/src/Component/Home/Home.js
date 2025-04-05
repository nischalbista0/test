import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import VehicleSlider from "../Vehicle/VehicleSlider";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        <section className="min-h-[100dvh] flex flex-col justify-center items-center relative bg-indigo-600 text-white text-center py-20">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative container mx-auto px-6">
            <h1 className="text-6xl font-extrabold text-shadow-lg mb-6">
              Welcome to RentRide Services
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Your trusted platform for hassle-free vehicle rentals. Browse,
              compare, and book vehicles for your next adventure, all at your
              fingertips.
            </p>
            <Link
              to={"/compare"}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition duration-300 shadow-lg transform hover:scale-105"
            >
              Compare Vehicles
            </Link>
          </div>
        </section>

        <VehicleSlider />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">Why Choose RentRide?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <i className="fas fa-car text-5xl text-indigo-600 mb-4"></i>
                <h3 className="text-2xl font-semibold mb-3">
                  Wide Selection of Vehicles
                </h3>
                <p>
                  Choose from a variety of vehicles, including compact cars,
                  SUVs, and luxury cars.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <i className="fas fa-clock text-5xl text-indigo-600 mb-4"></i>
                <h3 className="text-2xl font-semibold mb-3">
                  Quick and Easy Booking
                </h3>
                <p>
                  Our simple booking process ensures you can reserve a vehicle
                  in just a few clicks.
                </p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                <i className="fas fa-users text-5xl text-indigo-600 mb-4"></i>
                <h3 className="text-2xl font-semibold mb-3">
                  Customer Satisfaction
                </h3>
                <p>
                  We value customer feedback and strive to offer the best rental
                  experience possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">About Us</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              RentRide Services is a trusted platform for hassle-free vehicle
              rentals. We focus on offering a wide variety of vehicles and a
              seamless booking experience. Our mission is to make vehicle rental
              accessible and stress-free for everyone.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">What Our Customers Say</h2>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow-lg">
                <p className="text-lg italic mb-4">
                  "RentRide made my booking experience super easy! The car was
                  in great condition, and the process was seamless."
                </p>
                <h4 className="font-semibold">John Doe</h4>
                <p className="text-gray-500">Customer</p>
              </div>
              <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow-lg">
                <p className="text-lg italic mb-4">
                  "I was able to quickly compare cars and find the perfect one
                  for my trip. Highly recommend RentRide!"
                </p>
                <h4 className="font-semibold">Jane Smith</h4>
                <p className="text-gray-500">Customer</p>
              </div>
              <div className="w-full md:w-1/3 p-6 bg-gray-100 rounded-lg shadow-lg">
                <p className="text-lg italic mb-4">
                  "Excellent customer service! The booking was simple, and the
                  vehicle was delivered on time."
                </p>
                <h4 className="font-semibold">Emily Johnson</h4>
                <p className="text-gray-500">Customer</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ride?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Sign up now and experience the convenience of RentRide Services.
            </p>
            <Link
              to="/Registration"
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition duration-300 shadow-lg"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
