import React, { Component } from 'react'
import notFound from "../img/notFound.png"

export default class NotFound extends Component {
  componentDidMount() {
    document.title = "CraftiCards | Not Found";
    setTimeout(() => {
      this.props.history.push("/");
    }, 4000);
  }

  render() {
    return (
      <div className="container center-align">
        <h1>404</h1>
        <img className="hide-on-med-and-down" src={notFound} alt="Page not found" />
        <h2>Page not found.</h2>
      </div>
    );
  }
}
