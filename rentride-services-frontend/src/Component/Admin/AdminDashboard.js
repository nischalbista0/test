import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:8081/getDashboard", {
          credentials: "include",
        });
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gray-100">
      <AdminNav />
      <div className="mt-[90px] min-h-[calc(100vh-260px)] px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Users Section */}
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Users/Admin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Total Users</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalUsers || 0}
                </p>
              </div>
              <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Total Admins</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalAdmins || 0}
                </p>
              </div>
            </div>

            {/* Vehicles Section */}
            <h2 className="text-xl font-bold text-gray-700 mt-8 mb-4">
              Vehicles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-yellow-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Total Vehicles</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalVehicles || 0}
                </p>
              </div>
              <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Booked Vehicles</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalBookedVehicles || 0}
                </p>
              </div>
              <div className="p-6 bg-purple-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Available Vehicles</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalAvailableVehicles || 0}
                </p>
              </div>
            </div>

            {/* Bookings Section */}
            <h2 className="text-xl font-bold text-gray-700 mt-8 mb-4">
              Bookings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-indigo-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Total Bookings</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalBookings || 0}
                </p>
              </div>
              <div className="p-6 bg-orange-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Upcoming Checkouts</h2>
                <p className="text-3xl font-bold">
                  {dashboardData?.upcomingCheckouts || 0}
                </p>
              </div>
              <div className="p-6 bg-teal-500 text-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Total Revenue</h2>
                <p className="text-3xl font-bold">
                  Rs. {dashboardData?.totalRevenue || 0}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
