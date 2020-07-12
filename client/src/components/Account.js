import React, { Component } from 'react';
import Logout from "./utils/Logout";
import axios from 'axios';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      message: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    };
  }

  componentDidMount = async () => {
    document.title = "CraftiCards | Account";
    this.populate();
  }

  populate = async () => {
    const user = await this.props.getUser();
    this.setState({ user });
    this.setState({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: ""
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    }
    const res = await axios.patch("/users/me", user);

    if (res.data._id) {
      this.setState({ message: "Updated Successfully" });
      this.props.setUser(user);
      this.populate();
    }

  }

  deleteAccount = (e) => {
    e.preventDefault();
    this.props.history.push("/account/delete");
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    if (!this.state.user) {
      return (
        <div className="container">
          <h2>Loading...</h2>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="center-align">
            <h2>Account</h2>
            <Logout />
            <p>{this.state.message}</p>
          </div>
          <div className="row">

            <form className="col s6 offset-s3" onSubmit={this.handleSubmit}>
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
                    value={this.state.first_name}
                    onChange={this.handleChange}
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
                    value={this.state.last_name}
                    onChange={this.handleChange}
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
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="password">New password</label>
                  <br />
                  <input
                    name="password"
                    id="password"
                    type="password"
                    className="validate"
                    minLength="7"
                    value={this.state.password}
                    onChange={this.handleChange} />
                </div>
              </div>
              <div className="row center-align">
                <button
                  className="btn blue-grey waves-effect waves-light"
                >
                  Update
              </button>
              </div>
            </form>
          </div>
          <div className="center-align">
            <button className="btn red" onClick={this.deleteAccount}>
              Delete Account
            </button>


          </div>
        </div>
      );
    }
  }
}
