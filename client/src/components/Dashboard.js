import React, { Component } from 'react';

export default class Dashboard extends Component {
  componentDidMount = () => {
    document.title = "CraftiCards | Dashboard";
  }

  render() {
    return (
      <div className="container">
        <h1>Dashboard</h1>
      </div>
    );
  }
}
