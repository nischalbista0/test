import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt, FaUserPlus, FaUsers } from "react-icons/fa";

const AdminStaffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch("http://localhost:8081/getStaffs", {
          credentials: "include",
        });
        const data = await response.json();
        setStaffs(data.staffs);
      } catch (error) {
        toast.error("Failed to load staff members.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/addStaff", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      const data = await response.json();
      setStaffs([...staffs, data]);
      setNewStaff({ name: "", email: "", password: "" });
      toast.success("Staff added successfully!");

      window.location.reload();
    } catch (error) {
      toast.error("Failed to add staff.");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/deleteStaff/${staffId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setStaffs(staffs.filter((staff) => staff._id !== staffId));
        toast.success("Staff deleted successfully!");
      } else {
        toast.error("Failed to delete staff.");
      }
    } catch (error) {
      toast.error("Failed to delete staff.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <AdminNav />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-[90px] min-h-[calc(100vh-260px)] px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Staff Management
            </h2>

            {/* Add Staff Form */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <FaUserPlus className="text-blue-500 text-3xl" /> Add New Staff
              </h3>

              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-600 mb-2"
                    >
                      Username
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter Username"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                      className="border p-4 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition duration-200"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-600 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Email Address"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      className="border p-4 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-600 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, password: e.target.value })
                    }
                    className="border p-4 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-300"
                >
                  Add Staff
                </button>
              </form>
            </div>

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-500" /> Staff Members
            </h3>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffs && staffs.length > 0 ? (
                staffs.map((staff) => (
                  <div
                    key={staff._id}
                    className="p-5 bg-white rounded-lg shadow-lg flex flex-col items-center text-center relative"
                  >
                    <p className="text-gray-600 text-sm">{staff.email}</p>
                    <button
                      onClick={() => handleDeleteStaff(staff._id)}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  No staff members found.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStaffs;
