import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Admin_Checkout() {
  const navigate = useNavigate();
  const [checkouts, setCheckouts] = useState([]);

  async function fetchCheckouts() {
    try {
      const response = await fetch("http://localhost:8081/fetchCheckoutadmin", {
        credentials: "include",
      });
      const responseData = await response.json();
      console.log(responseData);
      setCheckouts(responseData.Checkouts);
    } catch (error) {
      toast.error("You are not admin", {
        position: "top-right",
      });
      navigate("/");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCheckouts();
  }, []);

  return (
    <>
      <AdminNav />
      <h1 className="V-heading font-bold text-xxl ">Checkout list</h1>
      <table className="w-full my-12">
        <thead>
          <tr className="shadow-lg border-black border-4 rounded-xxl  ">
            <th>Checkout Date</th>
            <th>Email</th>
            <th>Quantity</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Product ID</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.length > 0 ? (
            checkouts.map((checkout, index) => (
              <tr
                className="shadow-lg text-center border-black border-1 rounded-xxl"
                key={index}
              >
                <td>{new Date(checkout.createdAt).toLocaleString()}</td>
                <td>{checkout.email}</td>
                <td>
                  {checkout.products.map((product, index) => (
                    <div key={index}>{product.quantity}</div>
                  ))}
                </td>
                <td>
                  {checkout.products.map((product, index) => (
                    <div key={index}>{product.name}</div>
                  ))}
                </td>
                <td>
                  {checkout.products.map((product, index) => (
                    <div key={index}>{product.brand}</div>
                  ))}
                </td>
                <td>
                  {checkout.products.map((product, index) => (
                    <div key={index}>{product.productId}</div>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">LOADING....</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
