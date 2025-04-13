import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaCheckCircle, FaTrashAlt, FaUsers } from "react-icons/fa";

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleApproveVendor = async (vendorId) => {
    try {
      const response = await fetch(
        `http://localhost:8081/approveVendor/${vendorId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        setVendors((prev) =>
          prev.map((vendor) =>
            vendor._id === vendorId
              ? { ...vendor, approved: "approved" }
              : vendor
          )
        );
        toast.success("Vendor approved successfully!");
      } else {
        toast.error("Failed to approve vendor.");
      }
    } catch (error) {
      toast.error("Failed to approve vendor.");
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
        setVendors((prev) =>
          prev.filter((vendor) => vendor._id !== selectedVendor._id)
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
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-500" /> Vendor Members
            </h3>

            {/* Table for Vendor List */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Approval Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors && vendors.length > 0 ? (
                    vendors.map((vendor) => (
                      <tr
                        key={vendor._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{vendor.userName}</td>
                        <td className="px-4 py-2">{vendor.email}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              vendor.approved === "approved"
                                ? "bg-green-100 text-green-700"
                                : vendor.approved === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {vendor.approved}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {vendor.approved !== "approved" && (
                            <button
                              onClick={() => handleApproveVendor(vendor._id)}
                              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition duration-300 mr-2"
                            >
                              <FaCheck />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedVendor(vendor);
                              setShowModal(true);
                            }}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No vendor members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
