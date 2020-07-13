import React, { Component } from 'react'
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import Logout from "./Logout";

export default class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue-grey darken-3">
        <div className="container">
          <div className="row">
            <div className="col l9">
              <Link to="/" id="logo-container" className="brand-logo hide-on-med-and-down">
                <img className="logo-footer" src={logo} alt="CraftiCards" />
              </Link>
            </div>
            <div className="col s6 l3">
              <ul>
                <li><Link className="white-text show-on-small" to="/">Home</Link></li>
                <li><Link className="white-text" to="/about">About</Link></li>
                <li><Link className="white-text" to="/contact">Contact</Link></li>
                <li><Link className="white-text" to="/contribute">Contribute</Link></li>
                <li><Link className="white-text" to="/tos">Terms of Use</Link></li>
              </ul>
              <Logout />
            </div>
            <Link to="/" id="logo-container" className="brand-logo hide-on-large-only">
              <img className="logo-footer" src={logo} alt="CraftiCards" />
            </Link>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © 2020 CraftiCards
          </div>
        </div>
      </footer>
    )
  }
}
