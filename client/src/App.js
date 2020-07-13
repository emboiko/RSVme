import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
import ProtectedRoute from "./components/utils/router/ProtectedRoute";
import PublicOnlyRoute from "./components/utils/router/PublicOnlyRoute";
import NotFound from "./components/NotFound";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import AccountDelete from "./components/AccountDelete";
import Dashboard from "./components/Dashboard";
import CreateRSVP from "./components/CreateRSVP";
import ReadRSVP from './components/ReadRSVP';
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
  }

  componentDidMount = async () => {
    this.setUser(await this.getUser());
  }

  setUser = user => this.setState({ user });

  getUser = async () => {
    const res = await axios.get("/users/me");
    if (res.data._id) {
      return res.data;
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Header user={this.state.user} />
        <div className="main-wrapper">
          <main>
            <Switch>
              <Route
                exact
                path="/"
                render={routeProps => <Landing {...routeProps} user={this.state.user} />}
              />

              <PublicOnlyRoute
                exact
                path="/register"
                getUser={this.getUser}
                render={routeProps => <Register {...routeProps} setUser={this.setUser} />}
              />

              <PublicOnlyRoute
                exact
                path="/login"
                getUser={this.getUser}
                render={routeProps => <Login {...routeProps} setUser={this.setUser} />}
              />

              <ProtectedRoute
                exact
                path="/account"
                getUser={this.getUser}
                render={routeProps => <Account {...routeProps} getUser={this.getUser} setUser={this.setUser} />}
              />

              <ProtectedRoute
                exact
                path="/account/delete"
                getUser={this.getUser}
                render={routeProps => <AccountDelete {...routeProps} setUser={this.setUser} />}
              />

              <ProtectedRoute
                exact
                path="/dashboard"
                getUser={this.getUser}
                render={routeProps => <Dashboard {...routeProps} />}
              />

              <ProtectedRoute
                exact
                path="/cc"
                getUser={this.getUser}
                render={routeProps => <CreateRSVP {...routeProps} />}
              />

              <Route
                exact
                path="/cc/:id"
                render={routeProps => <ReadRSVP {...routeProps} />}
              />

              <Route
                render={routeProps => <NotFound {...routeProps} />}
              />

            </Switch>
          </main>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}
