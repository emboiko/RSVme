import React, { Component } from 'react'
import notFound from "../img/notFound.png"

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = { timeout: null }
  }

  componentDidMount = () => {
    document.title = "CraftiCards | Not Found";
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      this.props.history.push("/");
    }, 5000);
    this.setState({ timeout });
  }

  componentWillUnmount = () => clearTimeout(this.state.timeout);

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
