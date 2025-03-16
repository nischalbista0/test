import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useCart } from "../cart/cart";
import "./Product.css";
import { toast } from "react-toastify";
import Review from "../Review/Review";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Product = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user, "data");
  const [page, setPage] = useState(1);
  const [cart, setCart] = useCart();
  const [review, setReview] = useState(false);
  const [products, setProducts] = useState();
  const [productId, setProductId] = useState(null);
  const [reserve, setReserve] = useState();
  const [message, setMessage] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null); // State to hold the selected product for popup display
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State to manage popup visibility

  const itemsPerPage = 3;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const hasNextPage = products?.length > endIndex;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (productId !== null) {
      setReview(true);
    }
  }, [productId]);

  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:8081/products", {
        credentials: "include",
      });
      setMessage(response.message);
      const responseData = await response.json();
      setProducts(responseData.products);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCheckouts() {
    try {
      const response = await fetch("http://localhost:8081/fetchCheckout", {
        credentials: "include",
      });
      const responseData = await response.json();
      setMessage(responseData.message);
      setReserve(responseData.Checkouts);
    } catch (error) {
      console.error(error);
    }
  }

  const prevReserve = reserve?.filter(
    (reserve) => reserve.email === user?.rest.email
  );

  const handleReview = (productId) => {
    let hasReviewForProduct = false;
    prevReserve.forEach((reserve) => {
      reserve.products.forEach((product) => {
        if (product.productId === productId) {
          hasReviewForProduct = true;
          return;
        }
      });
    });

    if (hasReviewForProduct) {
      setProductId(productId);
    } else {
      toast.error("Please checkout to add review", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCheckouts();
  }, []);

  const handleCloseBooking = () => {
    setReview(false);
    setProductId(null); // Reset productId as well
  };

  // Function to handle opening the popup and setting selected product
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  // Function to handle closing the popup
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
    setReview(false);
  };

  // Function to handle adding the product to the cart
  const handleAddToCart = (product) => {
    const isProductInCart = cart.some((item) => item._id === product._id);

    if (isProductInCart) {
      toast.error("Product is already in the cart", {
        position: "top-right",
      });
    } else {
      setCart([...cart, product]);
      localStorage.setItem("cart", JSON.stringify([...cart, product]));
      toast.success("Item added to cart");
    }
  };

  return (
    <>
      <Navbar />
      <div className="V-heading">
        <div className="my-2">
          <a
            href="/Product"
            className="bg-white text-black border-4 border-black hover:bg-black hover:text-white hover:border-white font-bold py-1 px-2 rounded-xl"
          >
            <i className="fas fa-bag-shopping"></i> Products
          </a>
        </div>
      </div>

      <div className="p-main">
        {products ? (
          products.slice(startIndex, endIndex).map((x) => (
            <div key={x._id} className="p-inner">
              <div className="p-first">
                <img src={x.image} alt={x.name} />
                <div className="text-center my-6"></div>
                <br />
              </div>
              <div className="p-second">
                <h3 className="text-xl font-bold text-center">{x.name}</h3>
                <br />
                <p>
                  <b>Brand: </b>
                  {x.brand}
                </p>

                <p>
                  <b>Description: </b>
                  {x.description}
                </p>
                <p>
                  <b>Price: RS </b>
                  {x.price}
                </p>
                <br />

                <button
                    className="bg-black text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                    onClick={() => {
                    handleViewDetails(x); // Call function to view product details in popup
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="font-bold text-white">LOADING....</p>
        )}
      </div>
      <div className="flex justify-center my-4 mx-4">
        <button
          className="bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-l"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <FaArrowLeft />
        </button>
        <button
          className="bg-black text-white border-2 border-white hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-l"
          onClick={handleNextPage}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Render popup for selected product */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className=" text-xl font-bold border-black border-2 text-center bg-white p-8 rounded-lg  relative pop-main">
            <span
              className="close absolute top-0 right-0 px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleClosePopup}
            >
              <i className="fas fa-times" />
            </span>
            <div className="flex flex-col justify-between lg:flex-row gap-16 lg:items-center">
              <div className="flex flex-col gap-6 pop-img">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full aspect-square object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-4 lg:w-2/4 text-left pop-title">
                <div>
                  <span className=" text-violet-600 font-semibold">
                    {selectedProduct.brand}
                  </span>
                  <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
                </div>
                <p className="text-gray-700">{selectedProduct.description} </p>
                <h6 className="text-2xl font-semibold">
                  RS {selectedProduct.price}
                </h6>

                <div className="flex flex-row items-center gap-12">
                  <button
                    className="bg-black text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    Add to cart
                  </button>
                </div>
                <div>
                  <button
                    className="bg-black text-white border-2 border-gray-500 hover:bg-white hover:text-black hover:border-black font-bold py-1 px-2 rounded-xl"
                    onClick={() => {
                      handleReview(selectedProduct._id);
                    }}
                  >
                    Add Review
                  </button>
                  {review && (
                    <Review
                      productId={productId}
                      onClose={handleCloseBooking}
                    />
                  )}
                </div>
                <div>
                  <b>Review: </b>
                  <ul>
                    {selectedProduct.review.map((s, index) => (
                      <li key={index}> • {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
