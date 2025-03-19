import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";

const AdminVehicleRoute = ({ element, ...rest }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchAdminRole = async () => {
      try {
        const response = await fetch("http://localhost:8081/checkAdmin", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.userRole === "user") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching admin role:", error);
      }
    };

    fetchAdminRole();
  }, []);
  return isAdmin ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/profile" />
  );
};

export default AdminVehicleRoute;
