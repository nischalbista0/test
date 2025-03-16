import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminVehicleRoute from "./Component/utils/checkAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Component/Home/Home";
import Product from "./Component/Products/Product";
import Registration from "./Component/Registration/Registration";
import Login from "./Component/Login/Login";
import Vehicle from "./Component/Vehicle/Vehcile";
import Booking from "./Component/Booking/Booking";
import PrivateRoute from "./Component/PrivateRoute";
import Profile from "./Component/profile/profile";
import AdminVehicle from "./Component/Admin/Adminvehicle";
import CartPage from "./Component/cart/cartPage";
import ChangePassword from "./Component/profile/ChangePassword";
import History from "./Component/History/History";
import ForgotPassword from "./Component/Login/forgotPassword";
import ResetForm from "./Component/resetForm";
import Comparision from "./Component/Comparision/Comparision";
import Success from "./Component/Khalti/KhaltiSuccess";
import Admin_Booking from "./Component/Admin/Admin_Booking";
import Admin_Checkout from "./Component/Admin/Admin_Checkout";
import Footer from "./Component/Footer/Footer";
import Search from "./Component/Search/Search";
import AdminDashboard from "./Component/Admin/AdminDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
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

        <Route path="/cart" element={<CartPage />} />
        <Route path="/AdminBooking" element={<Admin_Booking />} />
        <Route path="/AdminCheckout" element={<Admin_Checkout />} />
        <Route path="/AdminVehicle" element={<AdminVehicle />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/khaltiSuccess" element={<Success />} />
        <Route path="/Booking" element={<Booking />} />
        {/* </Route> */}
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default App;
