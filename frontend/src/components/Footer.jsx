import React from 'react';
import { Link } from 'react-router-dom';
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
            
            <div className="social-icons mt-3 d-flex gap-3 ">
              <a  href="https://www.facebook.com"  target="_blank" rel="noopener noreferrer" aria-label="Facebook " className="text-decoration-none text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"  aria-label="Twitter" className="text-decoration-none text-white" >
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank"  rel="noopener noreferrer" aria-label="Instagram" className="text-decoration-none text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.whatsapp.com" target="_blank"  rel="noopener noreferrer" aria-label="WhatsApp"className="text-decoration-none text-white" >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a  href="https://www.youtube.com" target="_blank"   rel="noopener noreferrer" aria-label="YouTube" className="text-decoration-none text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>

          </div>
          <div className="col-6 col-md-3">
            <p className="mb-3 text-body-tertiary borde border-bottom paytone-one-regular">PAGES</p>
            <ul className="list-unstyled inter-small">
              <li>
                <Link to="/" className="text-decoration-none text-reset">
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-decoration-none text-reset">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Contact
                </Link>
              </li>
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

      </div>
    </footer>
  );
}
