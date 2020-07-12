import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      message: ""
    };
  }

  componentDidMount = () => document.title = "CraftiCards | Register";

  handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/users", {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    });

    if (res.data._id) {
      this.props.setUser(res.data);
      this.props.history.push("/dashboard");
    } else {
      // Todo
      this.setState({ message: "Email is already in use." });
    }
  }

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s6 offset-s3" onSubmit={this.handleSubmit}>
            <div className="center-align mtop">
              Have an account already?
              <br />
              <Link to="/login">Login</Link>
              <p className="err">{this.state.message}</p>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="first_name">First Name</label>
                <br />
                <input
                  name="first_name"
                  id="first_name"
                  type="text"
                  className="validate"
                  required
                  maxLength="60"
                  minLength="1"
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="last_name">Last Name</label>
                <br />
                <input
                  name="last_name"
                  id="last_name"
                  type="text"
                  className="validate"
                  required
                  maxLength="60"
                  minLength="1"
                  onChange={this.handleChange}
                />
              </div>
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
                  required
                  onChange={this.handleChange}
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
                  required
                  minLength="7"
                  onChange={this.handleChange} />
              </div>
            </div>
            <div className="row center-align">
              <button className="btn light-blue darken-4 waves-effect waves-light" type="submit" name="action">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
