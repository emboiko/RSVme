import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import Logout from "./Logout";
import logo from "../../img/logo.png";

export default class Header extends Component {
  render = () => {
    let userLinks;

    if (this.props.user) {
      userLinks = <>
        <li className="mright">
          <NavLink
            activeClassName="active-link"
            to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li className="mright">
          <NavLink
            activeClassName="active-link"
            to="/account">
            {this.props.user.first_name}
          </NavLink>
        </li>
        <li className="hide-on-med-and-down">
          <Logout />
        </li>
      </>
    } else {
      userLinks = <>
        <li>
          <NavLink
            activeClassName="active-link"
            to="/register">Register</NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="active-link"
            to="/login">Login</NavLink>
        </li>
      </>
    }

    return (
      <header className="page-header">
        <nav className="blue-grey darken-3" role="navigation">
          <div className="nav-wrapper container">
            <Link id="logo-container" to="/" className="brand-logo">
              <img className="logo" src={logo} alt="CraftiCards" />
            </Link>
            <ul className="right">
              {userLinks}
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
