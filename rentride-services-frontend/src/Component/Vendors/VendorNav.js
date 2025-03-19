import React, { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { FaArrowRight, FaUser } from "react-icons/fa";
import "../Navbar/Navbar.css";
import { useSelector } from "react-redux";

const VendorNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="NavbarItem">
        <h1 className="font-bold text-xl">RentRide Services</h1>
        <div className="MenuIcons" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "Navmenu active" : "Navmenu"}>
          <li>
            <Link className="NavLinks" to="/VendorVehicle">
              <i className="fas fa-car"></i>Vehicle
            </Link>
          </li>
          <li>
            <Link className="NavLinks" to="/VendorBooking">
              <i className="fas fa-list"></i>Bookings
            </Link>
          </li>
        </ul>

        <div className="corner-menu">
          {user ? (
            <Link to="/profile">
              <FaUser />
            </Link>
          ) : (
            <Link to="/Registration">
              <FaUser />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default VendorNav;
