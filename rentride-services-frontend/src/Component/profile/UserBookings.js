import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";

const UserBookings = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("http://localhost:8081/fetchBookingadmin", {
          credentials: "include",
        });
        const data = await res.json();
        const allBookings = data?.Bookings || [];
        const userBookings = allBookings.filter(
          (booking) => booking?.email === user?.rest?.email
        );
        setBookings(userBookings);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (user) fetchBookings();
  }, [user]);

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/cancel/${selectedBookingId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === selectedBookingId ? { ...b, status: "cancelled" } : b
          )
        );
        toast.success("Booking cancelled.");
      } else {
        toast.error("Cancellation failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setShowModal(false);
      setSelectedBookingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl font-medium animate-pulse">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-700">
            No bookings yet
          </h2>
          <p className="text-gray-500">Let’s get you started with a ride!</p>
          <button
            onClick={() => navigate("/Vehicle")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Browse Vehicles
          </button>
        </div>
      </>
    );
  }

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.checkOutDate) > new Date() && b.status === "active"
  ).length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === "active")
    .reduce((total, b) => total + parseFloat(b.price), 0);

  return (
    <>
      <Navbar />

      <div className="p-6 mt-28 max-w-7xl mx-auto animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Your Vehicle Bookings
          </h1>
          <p className="text-gray-500 mt-2">
            All your recent bookings in one place.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            label="Total Bookings"
            value={totalBookings}
            color="blue"
          />
          <SummaryCard
            label="Upcoming Bookings"
            value={upcomingBookings}
            color="purple"
          />
          <SummaryCard
            label="Cancelled Bookings"
            value={cancelledBookings}
            color="red"
          />
          <SummaryCard
            label="Total Spent"
            value={`Rs. ${totalSpent.toLocaleString()}`}
            color="green"
          />
        </div>

        {/* Booking Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left rounded">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">Model</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Check-out Date</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {booking.model}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    Rs. {booking.price}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{booking.contact}</td>
                  <td className="px-6 py-4 text-center">
                    {booking.status === "active" ? (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Cancelled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {booking.status === "active" && (
                      <button
                        onClick={() => openCancelModal(booking._id)}
                        className="text-red-600 font-medium hover:text-red-800 hover:underline transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Cancellation
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const SummaryCard = ({ label, value, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colorMap[color]} text-white rounded-lg p-6 shadow`}
    >
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default UserBookings;
