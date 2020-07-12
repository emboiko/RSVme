import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue-grey darken-3">
        <div className="container">
          <div className="row">
            <div className="col l8 ">
              <h5 className="white-text">Company Bio</h5>
              <p className="grey-text text-lighten-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem asperiores iste natus, eos dignissimos vel porro quaerat dolor qui quam?
              </p>
            </div>
            <div className="col l3 offset-l1">
              <h5 className="white-text">Links</h5>
              <ul>
                <li><Link className="white-text" to="/about">About</Link></li>
                <li><Link className="white-text" to="/contact">Contact</Link></li>
                <li><Link className="white-text" to="/contribute">Contribute</Link></li>
                <li><Link className="white-text" to="/tos">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            © CraftiCards 2020
          </div>
        </div>
      </footer>
    )
  }
}
