import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Component/Home/Home";
import Registration from "./Component/Registration/Registration";
import Login from "./Component/Login/Login";
import Vehicle from "./Component/Vehicle/Vehcile";
import Booking from "./Component/Booking/Booking";
import Profile from "./Component/profile/profile";
import AdminVehicle from "./Component/Admin/Adminvehicle";
import ChangePassword from "./Component/profile/ChangePassword";
import ForgotPassword from "./Component/Login/forgotPassword";
import ResetForm from "./Component/resetForm";
import Comparision from "./Component/Comparision/Comparision";
import Success from "./Component/Khalti/KhaltiSuccess";
import Admin_Booking from "./Component/Admin/Admin_Booking";
import Footer from "./Component/Footer/Footer";
import Search from "./Component/Search/Search";
import AdminDashboard from "./Component/Admin/AdminDashboard";
import AdminVendors from "./Component/Admin/AdminVendors";
import VendorBooking from "./Component/Vendors/VendorBooking";
import VendorVehicle from "./Component/Vendors/VendorVehicle";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/" element={<Home />} />
        <Route path="/Vehicle" element={<Vehicle />} />
        <Route path="/forgotP" element={<ForgotPassword />} />
        <Route path="/resetForm" element={<ResetForm />} />
        <Route path="/compare" element={<Comparision />} />
        <Route path="/search" element={<Search />} />

        {/* <Route element={<PrivateRoute />}> */}
        {/* <Route
            path="/AdminVehicle"
            element={<AdminVehicleRoute element={<Adminvehicle />} />}
          /> */}

        <Route path="/AdminBooking" element={<Admin_Booking />} />
        <Route path="/AdminVehicle" element={<AdminVehicle />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminVendors" element={<AdminVendors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/khaltiSuccess" element={<Success />} />
        <Route path="/Booking" element={<Booking />} />

        <Route path="/VendorBooking" element={<VendorBooking />} />
        <Route path="/VendorVehicle" element={<VendorVehicle />} />
        {/* </Route> */}
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default App;
