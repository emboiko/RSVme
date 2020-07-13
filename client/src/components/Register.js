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
      phone: "",
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
      phone: this.state.phone,
    });

    if (res.data._id) {
      this.props.setUser(res.data);
      this.props.history.push("/dashboard");
    } else {
      // Todo
      this.setState({ message: "Email is already in use." });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleKeyPress = (e) => {
    let val = e.target.value.replace(/[^\d\b-]/g, "");
    if (val.length === 3 && (e.data !== null)) val += "-";
    if (val.length === 7 && (e.data !== null)) val += "-";
    this.setState({ [e.target.name]: val });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s10 offset-s1 m8 offset-m2 l6 offset-l3" onSubmit={this.handleSubmit}>
            <div className="center-align mtop">
              Have an account already?
              <br />
              <Link to="/login">Login</Link>
              <p className="err">{this.state.message}</p>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="first_name">*First Name</label>
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
                  value={this.state.first_name}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="last_name">*Last Name</label>
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
                  value={this.state.last_name}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="email">*Email</label>
                <br />
                <input
                  name="email"
                  id="email"
                  type="email"
                  className="validate"
                  required
                  onChange={this.handleChange}
                  value={this.state.email}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="password">*Password</label>
                <br />
                <input
                  name="password"
                  id="password"
                  type="password"
                  className="validate"
                  required
                  minLength="7"
                  onChange={this.handleChange}
                  value={this.state.password}
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <label htmlFor="phone">Phone (Format: 123-456-7890)</label>
                <br />
                <input
                  name="phone"
                  id="phone"
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  className="validate"
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  value={this.state.phone}
                />
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

