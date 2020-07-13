import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
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
            className="email-trunc"
            to="/account">
            {this.props.user.email}
          </NavLink>
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
            <Link to="/" id="logo-container" className="brand-logo">
              <img className="logo hide-on-small-only" src={logo} alt="CraftiCards" />
            </Link>
            <Link to="/">
              <img className="logo small hide-on-med-and-up" src={logo} alt="CraftiCards" />
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
