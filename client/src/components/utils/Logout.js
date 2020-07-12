import React, { Component } from 'react';
import axios from "axios";

export default class Logout extends Component {
  logout = async () => {
    await axios.post("/users/logout");
    window.location.href = "/";
  }

  render() {
    return (
      <button
        className="blue-grey  waves-effect waves-light btn-small"
        onClick={this.logout}
      >
        Logout
      </button>
    );
  }
}
