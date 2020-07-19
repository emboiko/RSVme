import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import M from "materialize-css";
import logo from "../../img/logo.png";

export default class Header extends Component {
  componentDidMount = () => M.Sidenav.init(document.querySelectorAll('.sidenav'));

  render = () => {
    let userLinks;

    if (this.props.user) {
      userLinks = <>
        <li>
          <NavLink
            activeClassName="active-link"
            className="sidenav-close"
            to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="active-link"
            className="email-trunc sidenav-close"
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
            className="sidenav-close"
            to="/register">Register</NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="active-link"
            className="sidenav-close"
            to="/login">Sign In</NavLink>
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
              <div className="hide-on-med-and-down">
                {userLinks}
              </div>
              <Link to="#" data-target="mobile-links" className="sidenav-trigger"><i className="material-icons">menu</i></Link>
              <ul className="sidenav" id="mobile-links">
                {userLinks}
              </ul>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
