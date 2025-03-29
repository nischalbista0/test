import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrashAlt, FaUserPlus, FaUsers } from "react-icons/fa";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:8081/getVendors", {
          credentials: "include",
        });
        const data = await response.json();
        setVendors(data.vendors);
      } catch (error) {
        toast.error("Failed to load vendor members.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/addVendor", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      });

      const data = await response.json();
      if (data.message === "Vendor member already exists") {
        toast.error("Vendor member already exists");
        return;
      }
      toast.success("Vendor added successfully!");

      window.location.reload();
    } catch (error) {
      toast.error("Failed to add vendor.");
    }
  };

  const handleDeleteVendor = async () => {
    if (!selectedVendor) return;
    try {
      const response = await fetch(
        `http://localhost:8081/deleteVendor/${selectedVendor._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setVendors(
          vendors.filter((vendor) => vendor._id !== selectedVendor._id)
        );
        toast.success("Vendor deleted successfully!");
      } else {
        toast.error("Failed to delete vendor.");
      }
    } catch (error) {
      toast.error("Failed to delete vendor.");
    } finally {
      setShowModal(false);
      setSelectedVendor(null);
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
              Vendor Management
            </h2>

            {/* Add Vendor Form */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <FaUserPlus className="text-blue-500 text-3xl" /> Add New Vendor
              </h3>

              <form onSubmit={handleAddVendor} className="space-y-6">
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
                      value={newVendor.name}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, name: e.target.value })
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
                      value={newVendor.email}
                      onChange={(e) =>
                        setNewVendor({ ...newVendor, email: e.target.value })
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
                    value={newVendor.password}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, password: e.target.value })
                    }
                    className="border p-4 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition duration-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 focus:ring-2 focus:ring-blue-300"
                >
                  Add Vendor
                </button>
              </form>
            </div>

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-500" /> Vendor Members
            </h3>

            {/* Vendor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors && vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <div
                    key={vendor._id}
                    className="p-5 bg-white rounded-lg shadow-lg flex flex-col items-center text-center relative"
                  >
                    <p className="text-gray-600 text-sm">{vendor.email}</p>
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowModal(true);
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">
                  No vendor members found.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this vendor?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteVendor}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
