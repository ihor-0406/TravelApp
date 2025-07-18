import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer text-white">
      <div className="container pt-5">
        <div className="row gy-4">
          <div className="col-12 col-md-3">
            <p className=" mb-3 text-body-tertiary borde border-bottom paytone-one-regular ">CONTACT</p>
            <p className="mb-1 inter-small ">+354 551 1234</p>
            <p className="mb-1 inter-small ">+49 30 12345678</p>
            <p className="mb-1 inter-small ">hello@aurora.com</p>
            <p className="mt-3 inter-small ">Skarfabakki 12, 104<br />Reykjavik, Iceland</p>
            <div className="social-icons mt-3 d-flex gap-3">
              <i className="fab fa-facebook-f"></i>
              <i className="fab fa-x-twitter"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-whatsapp"></i>
              <i className="fab fa-youtube"></i>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <p className="mb-3 text-body-tertiary borde border-bottom paytone-one-regular">PAGES</p>
            <ul className="list-unstyled inter-small ">
              <li>Home</li>
              <li>About Us</li>
              <li>Tours</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <p className=" mb-3 text-body-tertiary  paytone-one-regular borde border-bottom">POPULAR TOURS</p>
            <ul className="list-unstyled inter-small ">
              <li>Golden Circle Tours</li>
              <li>South Coast Tours</li>
              <li>Adventure Bus</li>
              <li>Highland Bus</li>
              <li>Adventure Tours</li>
            </ul>
          </div>
          <div className="col-12 col-md-3">
            <p className="mb-3 text-body-tertiary borde border-bottom paytone-one-regular">NEED MORE INFO?</p>
            <ul className="list-unstyled inter-small ">
              <li>FAQs</li>
              <li>Privacy</li>
              <li>Customer Support</li>
              <li>Terms and Conditions</li>
            </ul>
          </div>
        </div>
        <hr className="border-top border-light opacity-50 my-4" />
        <div className="d-flex justify-content-between flex-column flex-md-row">
          <p className="inter-very-small">Designed by Marina Danilenka</p>
          <p className="inter-very-small ">© Copyright 2025</p>
        </div>
      </div>
    </footer>
  );
}
