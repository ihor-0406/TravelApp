import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/login.jsx';
import Profile from "./pages/profile.jsx";
import Register from "./pages/register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import  OAuthCallback  from "./pages/OAthCallback.jsx";
import Home from "./pages/Home.jsx";
import Tours from "./pages/Tours.jsx";
import TourDetails from "./pages/TourDetails.jsx";
import './App.css';


function App() {
  return (
    <Router>
      <Routes>

        <Route>
           <Route path="/login" element = {<Login/>} /> 
           <Route path="/register" element = {<Register/>}/>
           <Route path="/forgot-password" element = {<ForgotPassword/>} />
           <Route path="reset-password" element ={<ResetPassword/>}/>
        </Route>

        {/* <Route path="/" element={<LayoutWithHeader />}> */}
        <Route path="/" element={<Home/>}/>
        <Route path="/tours" element={<Tours/>}/>
        <Route path="/oauth2/callback" element={<OAuthCallback />} />
        <Route path="reset-password" element ={<ResetPassword/>}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/tours/:id" element={<TourDetails />} />

      </Routes>
    </Router>

  
  );
}


export default App;

