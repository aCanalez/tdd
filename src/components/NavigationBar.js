import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavigationBar = () => {
  const auth = useSelector((store) => store.auth);
  return (
    <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
      <div className="container">
        <Link to="/" title="Home" className="navbar-brand">
          <img src="/logo192.png" alt="logo" width={50} />
          Hoaxify
        </Link>
        <ul className="navbar-nav">
          {!auth.isLoggedIn && (
            <>
              <Link to="/signup" title="SignUp" className="nav-link">
                Sign Up
              </Link>
              <Link to="/login" title="Login" className="nav-link">
                Login
              </Link>
            </>
          )}
          {auth.isLoggedIn && (
            <Link
              to={`/user/${auth.id}`}
              title="MyProfile"
              className="nav-link"
            >
              My Profile
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
