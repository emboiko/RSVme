import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./utils/Loading";
import defaultCardImg from "../img/favicon.png";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { rsvps: [], loading: true };
  }

  componentWillUnmount = () => {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidMount = async () => {
    document.title = "CraftiCards | Dashboard";
    const req = await axios.get("/rsvps");
    if (req.status === 200) this.setState({ rsvps: req.data.rsvps, loading: false });
  }

  handleBrokenImage = (e) => e.target.src = defaultCardImg;

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <Loading />
        </div>
      );
    } else {
      const rsvps = this.state.rsvps.map((rsvp, i) => {
        return (
          <div key={i} className="card medium sticky-action">
            <div className="dboard-card card-image waves-effect waves-block waves-light">
              <img className="activator" onError={this.handleBrokenImage} src={`/rsvp/${rsvp.id}/img`} alt="Crafticard" />
            </div>
            <div className="card-content">
              <i className="material-icons activator right">more_vert</i>
              <p>{rsvp.title}</p>
              <p>{rsvp.location}</p>
              <p>{new Date(rsvp.date).toLocaleDateString()}</p>
            </div>
            <div className="card-action">
              <div className="center">
                <Link to={`/cc/${rsvp.id}`}>View</Link>
                <Link to={`/cc/${rsvp.id}/edit`}>Edit</Link>
                <Link to={`/cc/${rsvp.id}/delete`}>Delete</Link>
              </div>
              <br />
              <div className="center">
                <Link to={`/cc/${rsvp.id}/gl`}>Guest-List</Link>
              </div>
            </div>
            <div className="card-reveal">
              <span className="card-title grey-text text-darken-4"><i className="material-icons right">close</i></span>
              <h5>{rsvp.title}</h5>
              <div className="dboard-qr">
                <img src={rsvp.qr} alt="Crafticards QR-code" />
              </div>
            </div>
          </div>
        );
      });

      return (
        <div className="container">
          <div className="center">
            <h1>Dashboard</h1>
            <small>Under Construction</small>
            <Link to="/cc">New RSVP</Link>
          </div>
          <div className="row">
            <div className="col s8 offset-s2">
              {rsvps}
            </div>
          </div>
        </div>
      );
    }
  }
}
