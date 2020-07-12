import React, { Component } from 'react';
import axios from "axios";

export default class AccountDelete extends Component {
  componentDidMount = () => document.title = "CraftiCards | Delete Account";

  goBack = () => this.props.history.push("/account");

  deleteAccount = async () => {
    await axios.delete("/users/me");
    this.props.setUser(null);
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="container ">
        <div className="center-align">
          <h3>Are you sure?</h3>
          <p>Your account and any CraftiCards you have created will be lost.</p>
          <small>This cannot be reversed</small>
          <div className="button-box">
            <br />
            <button className="btn blue-grey" onClick={this.goBack}>
              Back
          </button>
            <br />
            <button className="btn red mtop" onClick={this.deleteAccount}>
              Delete Account
          </button>

          </div>
        </div>
      </div>
    );
  }
}
