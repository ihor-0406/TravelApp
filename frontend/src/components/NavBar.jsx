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
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
const [role, setRole] = useState(null);

  useEffect(() => {
  axios
    .get("/api/profile", { withCredentials: true })
    .then((res) => {
      setIsLoggedIn(true);
      setAvatarUrl(res.data.avatarUrl || avatarUrl);
      setRole(res.data.role); 
    })
    .catch(() => {
      setIsLoggedIn(false);
      setAvatarUrl("https://cdn-icons-png.flaticon.com/512/149/149071.png");
      setRole(null); 
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
              <Link className="nav-link active text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/tours">
                Tours
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="#">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="#">
                About Us
              </Link>
            </li>
          </ul>

          {!isLoggedIn ? (
            <ul className="navbar-nav ms-auto  text-end">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Sign in
                </Link>
              </li>
            </ul>
          ) : (
            <div className="dropdown  ms-auto">
              <Link
                to={"/profile"}
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={avatarUrl}
                  alt="avatar"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </Link>
              <ul className="dropdown-menu dropdown-menu-end text-small">
                <li>
                 {role === "ADMIN" ? (
                  <Link className="dropdown-item" to="/admin">Admin Panel</Link>
                ) : (
                <Link className="dropdown-item" to="/profile">Profile</Link>
                )}
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
