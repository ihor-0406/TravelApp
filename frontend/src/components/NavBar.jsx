import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../image/Logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '../styles/Navbar.css'

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://cdn-icons-png.flaticon.com/512/149/149071.png" );
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);



      useEffect(() => {
        axios
          .get("/api/profile", { withCredentials: true })
          .then((res) => {
            if (!res.data.email || res.data.email === "anonymousUser") {
              setIsLoggedIn(false);
              setAvatarUrl("https://cdn-icons-png.flaticon.com/512/149/149071.png");
              setRole(null);
            } else {
              setIsLoggedIn(true);
              setAvatarUrl(res.data.avatarUrl && res.data.avatarUrl.trim() !== ""
                ? res.data.avatarUrl
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png");
              setRole(res.data.role);
            }
          })
          .catch(() => {
            setIsLoggedIn(false);
            setAvatarUrl("https://cdn-icons-png.flaticon.com/512/149/149071.png");
            setRole(null);
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);



  const handleLogout = () => {
    axios
      .post("/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setAvatarUrl("https://cdn-icons-png.flaticon.com/512/149/149071.png");
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-transparent border-bottom ">
      <div className="container-fluid  ">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item ">
              <Link className="nav-link active text-white paytone-one-regular" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white paytone-one-regular" to="/tours">
                Tours
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white paytone-one-regular" to="#">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white paytone-one-regular" to="#">
                About Us
              </Link>
            </li>
          </ul>
              {loading ? (
                null 
              ) : isLoggedIn ? (
                <div className="dropdown ms-auto">
                  <Link
                    to={"/profile"}
                    className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      width="55"
                      height="55"
                      className="rounded-circle border border-3 me-3"
                    />
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end text-small">
                    <li>
                      {role === "ADMIN" ? (
                        <Link className="dropdown-item inter-medium " to="/admin">Admin Panel</Link>
                      ) : (
                        <Link className="dropdown-item inter-medium " to="/profile">Profile</Link>
                      )}
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item inter-medium "
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="navbar-nav ms-auto text-end">
                  <li className="nav-item">
                    <Link className="nav-link text-white paytone-one-regular" to="/login">
                      Sign in
                    </Link>
                  </li>
                </ul>
              )}


        </div>
      </div>
    </nav>
  );
};

export default NavBar;
