import React, { Component } from 'react';
import Loading from "./utils/Loading";
import axios from 'axios';
import defaultUserAvatar from "../img/defaultUserIcon.png";

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      message: "",
      file: null,
      avatar: "",
      avatarDeleteButtonID: "delete-avatar",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: ""
    };
    this.initialState = {};
  }

  componentWillUnmount = () => {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount = async () => {
    this.populate();
    document.title = "CraftiCards | Account";
    window.scrollTo(0, 0);
  }

  populate = async () => {
    const user = await this.props.getUser();
    this.setState({ user });
    this.setState({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      phone: user.phone,
      avatar: `/users/${user._id}/avatar`
    });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone,
    }
    const res = await axios.patch("/users/me", user);

    if (res.data._id) {
      this.setState({ message: "Updated Successfully" });
      this.props.setUser(user);
      this.populate();
    }
  }

  handleAvatarSubmit = async (e) => {
    e.preventDefault();
    this.setState({ message: "" });
    if (!this.state.file) {
      return this.setState({ message: "No file selected." });
    }

    const formData = new FormData();
    formData.append("avatar", this.state.file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    try {
      const res = await axios.post("/users/me/avatar", formData, config);
      if (res.status === 201) {
        this.setState({ avatar: `/users/${this.state.user._id}/avatar?` + new Date().getTime() })
        this.setState({
          avatarDeleteButtonID: "delete-avatar"
        });
      }
    } catch (err) {
      this.setState({ message: "Max file size 1MB | Format .PNG or .JPG" });
    }
  }

  deleteAccount = (e) => {
    e.preventDefault();
    this.props.history.push("/account/delete");
  }

  deleteAvatar = async () => {
    const res = await axios.delete("/users/me/avatar");
    if (res.status === 200) {
      this.setState({
        avatar: `/users/${this.state.user._id}/avatar?` + new Date().getTime()
      });
      this.setState({
        avatarDeleteButtonID: "hidden"
      });
    }
  }

  handleChange = (e) => {
    switch (e.target.name) {
      case 'avatar':
        this.setState({ file: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleKeyPress = (e) => {
    let val = e.target.value.replace(/[^\d\b-]/g, "");
    if (val.length === 3 && (e.data !== null)) val += "-";
    if (val.length === 7 && (e.data !== null)) val += "-";
    this.setState({ [e.target.name]: val });
  }

  handleBrokenImage = (e) => {
    e.target.src = defaultUserAvatar;
    e.target.style = { width: "50px" };
    this.setState({
      avatarDeleteButtonID: "hidden"
    });
  }

  render() {
    if (!this.state.user) {
      return (
        <div className="container">
          <Loading />
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="center-align">
            <h2>Account</h2>
            <p>{this.state.message}</p>

            <img
              src={this.state.avatar}
              alt="Avatar"
              className="account-avatar mbottom mtop"
              onError={this.handleBrokenImage}
            />
            <form
              encType="multipart/form-data"
              onSubmit={this.handleAvatarSubmit}
              onChange={this.handleChange}
            >
              <br />
              <input
                className="mtop mbottom"
                accept=".jpeg,.jpg,.png"
                type="file"
                name="avatar" />
              <br />
              <button className="btn blue-grey darken-3 mtop mbottom fixed-width-btn">
                Upload
                <i className="material-icons right">file_upload</i>
              </button>
            </form>

            <button
              className="btn mtop mbottom red fixed-width-btn"
              id={this.state.avatarDeleteButtonID}
              onClick={this.deleteAvatar}
            >
              Delete Avatar
            </button>

          </div>
          <div className="row">

            <form className="col s10 offset-s1 m8 offset-m2 l6 offset-l3" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="firstName">*First Name</label>
                  <br />
                  <input
                    name="firstName"
                    id="firstName"
                    type="text"
                    className="validate"
                    required
                    maxLength="60"
                    minLength="1"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="lastName">*Last Name</label>
                  <br />
                  <input
                    name="lastName"
                    id="lastName"
                    type="text"
                    className="validate"
                    required
                    maxLength="60"
                    minLength="1"
                    value={this.state.lastName}
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
              <div className="row">
                <div className="input-field col s12">
                  <label htmlFor="phone">Phone <small>(Format: 123-456-7890)</small></label>
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
                <button
                  className="btn blue-grey darken-3 waves-effect waves-light"
                >
                  Update
                  <i className="material-icons right">sync</i>
                </button>
              </div>
            </form>
          </div>
          <div className="center-align">
            <button className="btn red mbottom" onClick={this.deleteAccount}>
              Delete Account
              <i className="material-icons right">delete</i>
            </button>
          </div>
        </div>
      );
    }
  }
}
