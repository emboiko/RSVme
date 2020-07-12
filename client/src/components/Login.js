import React, { Component } from 'react';
import { Link, } from "react-router-dom";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      message: ""
    };
  }

  componentDidMount = () => document.title = "CraftiCards | Login";

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/users/login",
        { email: this.state.email, password: this.state.password }
      );

      if (res.data._id) {
        this.props.setUser(res.data);
        this.props.history.push("/dashboard");
      }
    } catch (err) {
      this.setState({ message: "Unable to login. Check your credentials and try again." });
    }
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s6 offset-s3" onSubmit={this.handleSubmit}>
            <div className="center-align mtop">
              Don't have an account?
              <br />
              <Link to="/register">Register</Link>
              <p>
                {this.state.message}
              </p>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="email">Email</label>
                <br />
                <input
                  name="email"
                  id="email"
                  type="email"
                  className="validate"
                  required onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="password">Password</label>
                <br />
                <input
                  name="password"
                  id="password"
                  type="password"
                  className="validate"
                  required onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="row center-align">
              <button className="btn light-blue darken-4 waves-effect waves-light" type="submit" name="action">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
