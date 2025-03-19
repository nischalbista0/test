import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Navbar/Navbar";

const History = () => {
  const { user } = useSelector((state) => state.user);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch("http://localhost:8081/fetchBooking", {
          credentials: "include",
        });
        const data = await response.json();
        setBookingData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBooking();
  }, []);

  const reqBooking = bookingData?.Bookings?.filter(
    (booking) => user && user.rest && booking.email === user.rest.email
  );

  return (
    <div>
      <Navbar />

      <h1 className="font-bold font-xxxl text-center V-heading">
        Booking History
      </h1>
      <table className="w-full my-12">
        <thead>
          <tr className="p-4 shadow-lg border-black border-4 rounded-xxl text-semibold  h-24">
            <th>Image</th>
            <th>UserName</th>
            <th>Brand</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {reqBooking ? (
            reqBooking.map((booking) => (
              <tr
                className="p-4 shadow-lg text-center border-black border-1 rounded-xl text-semibold mb-16px"
                key={booking._id}
              >
                <td>
                  <img
                    src={booking.image}
                    alt={booking.name}
                    className="mx-auto shadow-lg rounded-xl  h-24 w-24 "
                  />
                </td>
                <td>
                  <h3 className="text-xl font-bold text-center">
                    {booking.userName}
                  </h3>
                </td>
                <td>
                  <p>{booking.brand}</p>
                </td>
                <td>
                  <p>{booking.description}</p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading..</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
