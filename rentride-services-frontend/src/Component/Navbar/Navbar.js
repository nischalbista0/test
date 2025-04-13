import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HashLink as Link } from "react-router-hash-link";
import Profile from "../profile/profile";
import { FaUser } from "react-icons/fa";
import { Badge } from "antd";
import { searchStart, searchSuccess } from "../../redux/user/searchSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { searchStatus } = useSelector((state) => state.search);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    dispatch(searchStart());
    dispatch(searchSuccess(searchTerm));
  }, [searchTerm]);

  const handleSubmit = () => {
    if (searchStatus === "") {
    } else {
      navigate("/search?searchTerm=" + searchTerm);
    }
  };
  return (
    <>
      <nav className="NavbarItem">
        <h1 className="text-2xl font-bold">RentRide Services</h1>
        <div className="MenuIcons" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "Navmenu active" : "Navmenu"}>
          <li>
            <Link className="NavLinks" to="/">
              <i className="fas fa-house"></i>Home
            </Link>
          </li>
          <li>
            <Link className="NavLinks" to="/Vehicle">
              <i className="fas fa-car"></i>Vehicle
            </Link>
          </li>
          <li>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="bg-slate-100 p-1.5 border-2 border-grey rounded-3xl flex ml-5 items-center"
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent focus:outline-none w-20 sm:w-40"
                value={searchTerm}
                onChange={handleSearchChange}
              ></input>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </li>
        </ul>

        <div className="corner-menu">
          {user ? (
            <Link to="/profile">
              <FaUser />
            </Link>
          ) : (
            <Link to="/login">
              <FaUser />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
