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
import NavBar from "./components/NavBar";
import axios from "axios";

function AppRoutes({ account }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/callback" element={<OAuthCallback />} />
      <Route path="/profile" element={<Profile account={account} />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/success" element={<Success />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/admin" element={<AdminPanel account={account} />} />
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
      <AppRoutes account={account} />
    </Router>
  );
}
