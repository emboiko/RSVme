import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
import NotFound from "./components/NotFound";
import Header from "./components/utils/Header";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import AccountDelete from "./components/AccountDelete";
import Dashboard from "./components/Dashboard";
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount = async () => await this.getUser();

  setUser = user => this.setState({ user });

  getUser = async () => {
    const res = await axios.get("/users/me");
    if (res.data._id) {
      this.setUser(res.data);
      return res.data;
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Header user={this.state.user} />

        <Switch>

          <Route
            exact
            path="/"
            render={routeProps => <Landing {...routeProps} user={this.state.user} />}
          />

          <Route
            exact
            path="/account"
            render={routeProps => <Account {...routeProps} getUser={this.getUser} />}
          />

          <Route
            exact
            path="/account/delete"
            render={routeProps => <AccountDelete {...routeProps} setUser={this.setUser} />}
          />

          <Route
            exact
            path="/register"
            render={routeProps => <Register {...routeProps} setUser={this.setUser} />}
          />

          <Route
            exact
            path="/login"
            render={routeProps => <Login {...routeProps} setUser={this.setUser} />}
          />

          <Route
            exact
            path="/dashboard"
            render={routeProps => <Dashboard {...routeProps} />}
          />

          <Route
            render={routeProps => <NotFound {...routeProps} />}
          />

        </Switch>

      </BrowserRouter>
    );
  }
}
