import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, removeUser }) {
  // const [location.pathname, setButtonId] = useState('/home/dashboard');

  const location = useLocation();
  const hideNav = () => {
    document.getElementById("navbarSupportedContent").classList.remove("show");

    // setButtonId(location.pathname)
  };
  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/signup"
    ) {
      document.getElementById("navbar-show").classList.remove("d-lg-none");
      document.getElementById("navbar-show").classList.remove("d-inline");
    } else {
      document.getElementById("navbar-show").classList.add("d-lg-none");
      document.getElementById("navbar-show").classList.add("d-inline");
    }
    // if(location.pathname === '/home'){
    //   setButtonId('/home/dashboard')
    // }else{
    //   setButtonId(location.pathname)
    // }
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar navbar-expand-lg" id="navbar-show">
        <div className="container-fluid">
          {user ? (
            <Link to="/home/dashboard">
              <div className="d-flex py-0 ps-4 align-items-center">
                <div className="logo-img me-2 d-flex align-items-center cursor-pointer">
                  <i className="fa-regular fa-comments fa-2xl"></i>
                </div>
                <h3 className="cursor-pointer"> Chatbox </h3>
              </div>
            </Link>
          ) : (
            <Link to="/">
              <div className="d-flex py-0 ps-4 align-items-center">
                <div className="logo-img me-2 d-flex align-items-center cursor-pointer">
                  <i className="fa-regular fa-comments fa-2xl"></i>
                </div>
                <h3 className="cursor-pointer"> Chatbox </h3>
              </div>
            </Link>
          )}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-lg-none d-inline ">
              {user ? (
                <>
                  <li
                    className={
                      location.pathname === "/home/dashboard"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/home/dashboard">
                      <div className="side-nav-item my-3 d-flex justify-content-lg-start justify-content-center">
                        <div className="side-nav-item-icon me-3 ">
                          <i className="fa-xl fa-solid fa-cubes"></i>
                        </div>
                        <p className="h5"> Dashboard </p>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/home/groups"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/home/groups">
                      <div className="side-nav-item my-3 d-flex justify-content-lg-start justify-content-center">
                        <div className="side-nav-item-icon me-3">
                          <i className="fa-xl fa-solid fa-user-group"></i>
                        </div>
                        <p className="h5"> Groups </p>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/home/messages"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/home/messages">
                      <div className="side-nav-item my-3 d-flex justify-content-lg-start justify-content-center">
                        <div className="side-nav-item-icon me-3">
                          <i className="fa-xl fa-regular fa-comment-dots"></i>
                        </div>
                        <p className="h5"> Messages </p>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/home/profile"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/home/profile">
                      <div className="side-nav-item my-3 d-flex justify-content-lg-start justify-content-center">
                        <div className="side-nav-item-icon me-3">
                          <i className="fa-xl fa-solid fa-user-large"></i>
                        </div>
                        <p className="h5"> Profile </p>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item" onClick={hideNav}>
                    <div
                      className="side-nav-item my-3 d-flex justify-content-xl-start justify-content-center logout"
                      onClick={removeUser}
                    >
                      <div className="side-nav-item-icon me-3">
                        <i className="fa-solid fa-person-walking-arrow-right fa-flip-horizontal fa-2xl"></i>
                      </div>
                      <p className="h5 "> Logout </p>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className={
                      location.pathname === "/login"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/login">
                      <div className="side-nav-item my-3 d-flex justify-content-xl-start justify-content-center logout">
                        <p className="h5 "> Login </p>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={
                      location.pathname === "/signup"
                        ? "nav-item active"
                        : "nav-item"
                    }
                    onClick={hideNav}
                  >
                    <Link to="/signup">
                      <div className="side-nav-item my-3 d-flex justify-content-xl-start justify-content-center logout">
                        <p className="h5 "> Sign up </p>
                      </div>
                    </Link>
                  </li>
                </>
              )}
              {/* <li className= {location.pathname === '/home/dashboard' ? "nav-item active" : "nav-item"} onClick={hideNav}>
                  <Link to='/settings'>
                  <div className="side-nav-item my-3 d-flex justify-content-lg-start justify-content-center">
                    <div className="side-nav-item-icon me-3">
                      <i className="fa-xl fa-solid fa-gear"></i>
                    </div>
                    <p className="h5"> Settings </p>
                  </div>
                  </Link>
                </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
