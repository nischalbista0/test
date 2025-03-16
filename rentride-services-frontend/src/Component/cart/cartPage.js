import React, { useEffect, useState } from "react";
import { useCart } from "./cart";
import { useNavigate } from "react-router-dom";
import "../Products/Product.css";
import { useSelector, useDispatch } from "react-redux";
import Khalti from "../Khalti/Khalti";
import {
  reservationReset,
  reservationStart,
  reservationSuccess,
} from "../../redux/user/reservationSlice";
import { paymentReset } from "../../redux/user/paymentSlice";
import Navbar from "../Navbar/Navbar";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [khalti, setKhalti] = useState(false);
  const { reservationStatus } = useSelector((state) => state.reservation);
  const { paymentStatus } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [itemQuantities, setItemQuantities] = useState({});

  useEffect(() => {
    let quantities = {};
    cart.forEach((item) => {
      quantities[item._id] = 1; // Default quantity is 1
    });
    setItemQuantities(quantities);
  }, [cart]);

  const totalPrice = () => {
    try {
      let total = 0;
      cart.forEach((item) => {
        total += item.price * itemQuantities[item._id];
      });
      const formattedTotal = total.toLocaleString("en-US", {
        style: "currency",
        currency: "NRs",
      });
      // Extracting only the numeric part
      const numericTotal = formattedTotal.replace(/[^\d.-]/g, "");
      return numericTotal;
    } catch (error) {
      console.log(error);
    }
  };

  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };
  const handleQuantityChange = (pid, newQuantity) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [pid]: newQuantity,
    }));
  };

  useEffect(() => {
    if (paymentStatus === "success") {
      handleConfirmBooking();
    }
  }, [paymentStatus]);

  const handleKhalti = (e) => {
    e.preventDefault();
    const updatedCart = cart.map((item) => ({
      ...item,
      quantity: itemQuantities[item._id], // Set the quantity from itemQuantities
    }));

    const requestBody = {
      cart: updatedCart,
      email: user.rest.email,
    };

    console.log(requestBody, "body");
    dispatch(reservationStart());
    dispatch(reservationSuccess(requestBody));
    setKhalti(true);
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch("http://localhost:8081/createCheckout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationStatus),
      });
      if (response.ok) {
        localStorage.removeItem("cart");

        setCart([]);
        dispatch(reservationReset());
        dispatch(paymentReset());
        setTimeout(function () {
          navigate("/product");
        }, 3000);
      }
    } catch (error) {
      console.error("Error product buying", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="V-heading">
        <div>
          <a
            href="/Cart"
            className="mr-3 bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-cart-shopping"></i> Cart
          </a>
        </div>
        <div>
          <a
            href="/History"
            className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl "
          >
            <i className="fas fa-book"></i> History
          </a>
        </div>
      </div>
      <div className="my-10">
        <div>
          <h4 className="font-bold text-xxl text-gray-600">
            {cart?.length > 0
              ? `You have ${cart?.length} items in your cart`
              : ""}
          </h4>
        </div>
      </div>

      <table className="w-full h-10 ">
        <thead>
          <tr className="shadow-lg border-black border-4 rounded-xxl  ">
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart ? (
            cart.map((item) => (
              <tr
                className="p-4 shadow-lg rounded-xl text-semibold"
                key={item._id}
              >
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mx-auto shadow-lg rounded-xl  h-24 w-24 "
                  />
                </td>
                <td className="text-center">{item.name}</td>
                <td className="text-center">{item.brand}</td>
                <td className="text-center">{item.description}</td>
                <td className="text-center">Rs{item.price}</td>
                <td className="text-center">
                  <div className="flex flex-row items-center">
                    <button
                      className="bg-gray-200 py-2 px-5 rounded-lg text-violet-800 text-3xl"
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          itemQuantities[item._id] - 1
                        )
                      }
                      disabled={itemQuantities[item._id] === 1}
                    >
                      -
                    </button>
                    <span className="py-4 px-6 rounded-lg">
                      {itemQuantities[item._id]}
                    </span>
                    <button
                      className="bg-gray-200 py-2 px-4 rounded-lg text-violet-800 text-3xl"
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          itemQuantities[item._id] + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => removeCartItem(item._id)}
                    className=" bg-red-400 text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="font-bold text-white">
                LOADING....
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="my-12">
        <h2>Cart Summary </h2>
        <p>Total | Checkout | Payment</p>
        <hr />
        <h4> Total: {totalPrice()}</h4>
        <br />
        <button
          className=" bg-purple-400 text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
          onClick={handleKhalti}
        >
          Pay with Khalti
        </button>
      </div>
      {khalti && <Khalti amounto={totalPrice()} purpose={"product"} />}
    </>
  );
};

export default CartPage;
