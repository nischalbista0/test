import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);

  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:8081/fetchUser", {
          credentials: "include",
        });
        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);

  const reqUser = responseData?.Users?.filter(
    (usero) => usero?.email === user?.rest?.email
  )[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const response = await fetch(`http://localhost:8081/logout`, {
        method: "GET",
        credentials: "include", // Include credentials (cookies) with the request
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure());
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="wrapper">
          <h1 className="font-semibold">Profile</h1>
          {reqUser ? (
            <div>
              <div>
                <p>Email: {reqUser.email}</p>
                <br />
                <p>Role: {reqUser.role}</p>
              </div>
              <br />
              <div>
                <button
                  className="change"
                  onClick={() => navigate("/changePassword")}
                >
                  Change Password
                </button>
                <br />
                <br />
                {user && (
                  <button className="sign" onClick={handleSignOut}>
                    Sign out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6">
              <p className="text-xl font-bold">You are not logged in!</p>
              <p className="text-lg">Please <Link to="/login" className="text-blue-500 hover:underline">Login</Link> to continue!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
