import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";
import Register from "./pages/register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OAuthCallback from "./pages/OAthCallback.jsx";
import Home from "./pages/Home.jsx";
import Tours from "./pages/Tours.jsx";
import TourDetails from "./pages/TourDetails.jsx";
import Success from "./pages/Success.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import AdminPanel from "./components/AdminPanel";
import NavBar from "./components/NavBar.jsx";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function AppRoutes({ account, setAccount }) {
useEffect(() => {
  axios.get('/api/auth/user')
    .then((res) => {
      console.log("User is authenticated", res.data);
        setAccount(res.data);
    })
    .catch((err) => {
      console.log("Not authenticated");
        setAccount(null);
    });
}, []);


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/callback" element={<OAuthCallback />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/success" element={<Success />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/profile", { withCredentials: true })
      .then((res) => {
        if (res.data?.email && res.data.email !== "anonymousUser") {
          setAccount(res.data);
        } else {
          setAccount(null);
        }
      })
      .catch(() => setAccount(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Router>
      <NavBar account={account} isLoading={isLoading} />
        <AppRoutes account={account} setAccount={setAccount} />
    </Router>
  );
}
