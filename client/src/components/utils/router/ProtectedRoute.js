import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";

export default class ProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    }
  }

  componentDidMount = async () => {
    const user = await this.props.getUser();
    if (user) this.setState({ user });
    this.setState({ loading: false });
  }

  render() {
    const Component = this.props.render;

    if (this.state.loading) {
      return (
        <div className="container">
          <h1>Loading...</h1>
        </div>
      )
    } else {
      if (!this.state.user) {
        return (
          <Redirect to="/login" />
        );
      } else {
        return (
          <Route {...this.props} render={
            routeProps => <Component {...this.props} {...routeProps} />
          } />
        );
      }
    }
  }

}
