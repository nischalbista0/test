import { Component } from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer class="footer">
      <div class="footer-container">
        <div class="row">
          <div class="footer-col">
            <h4>Pages</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/vehicle">Vehicle</a>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>company</h4>
            <ul>
              <li>
                <a href="/">about us</a>
              </li>
              <li>
                <a href="/">our services</a>
              </li>
              <li>
                <a href="/">privacy policy</a>
              </li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>follow us</h4>
            <div class="social-links">
              <a href="/">
                <i class="fab fa-facebook-f"></i>
              </a>

              <a href="/">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
