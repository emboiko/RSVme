import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "./utils/Loading";
import PrivateGuestList from "./utils/PrivateGuestList";
import defaultCardImg from "../img/favicon.png";
import mail from "../img/mail.png";
import M from "materialize-css";

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
    const req = await axios.get("/rsvps");
    if (req.status === 200) this.setState({ rsvps: req.data.rsvps, loading: false });
    M.Modal.init(document.querySelectorAll('.modal'));
    document.title = "CraftiCards | Dashboard";
    window.scrollTo(0, 0);
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
          <div key={i} className="card sticky-action">
            <div className="card-image padded waves-effect waves-block waves-light">
              <img
                className="activator card-img"
                onError={this.handleBrokenImage}
                src={`/rsvp/${rsvp.id}/img`}
                alt="Crafticard"
              />
            </div>
            <div className="card-content">
              <h5 className="center">{rsvp.title}</h5>
              <i className="material-icons activator right">more_vert</i>
              <br />
            </div>
            <div className="card-action brown lighten-5">
              <div className="center">

                <Link
                  className="waves-effect waves-light blue-grey darken-3 btn card-btn mbottom"
                  to={`/cc/${rsvp.id}`}
                >
                  Card
                  <i className="material-icons right">card_giftcard</i>
                </Link>
                <br />
                <Link
                  className="waves-effect waves-light blue-grey darken-3 btn card-btn mbottom"
                  to={`/cc/${rsvp.id}`}
                >
                  View
                  <i className="material-icons right">visibility</i>
                </Link>
                <Link
                  className="waves-effect waves-light blue-grey darken-3 btn card-btn mright mleft mbottom"
                  to={`/cc/${rsvp.id}/edit`}
                >
                  Edit
                  <i className="material-icons right">edit</i>
                </Link>
                <Link
                  className="waves-effect waves-light red btn card-btn mbottom"
                  to={`/cc/${rsvp.id}/delete`}
                >
                  <i className="material-icons right">delete</i>
                  Delete
                </Link>

                <br />
                <button
                  className="waves-effect waves-light blue-grey darken-3 btn modal-trigger"
                  data-target={`modal${i}`}
                >
                  <i className="material-icons right">people</i>
                  Guests &nbsp;
                </button>

              </div>
            </div>

            <div className="card-reveal">
              <span className="card-title grey-text text-darken-4"><i className="material-icons right">close</i></span>
              <br />
              <h5 className="center">{rsvp.title}</h5>
              <hr />
              <div className="dboard-qr">
                <img className="qr" src={rsvp.qr} alt="Crafticards QR-code" />
                <p className="center bold">
                  Pin:
                  <br />
                  {rsvp.pin}
                </p>
              </div>
            </div>

            <div id={`modal${i}`} className="modal">
              <div className="modal-close">
                <i className="material-icons">close</i>
              </div>
              <div className="modal-content">
                <PrivateGuestList rsvp={rsvp} />
              </div>
              <div className="modal-footer">
                <span
                  className="modal-close waves-effect waves-green btn-flat">
                  Close
                </span>
              </div>
            </div>

          </div>
        );
      });

      return (
        <div className="container">
          <div className="center">
            <Link to="/cc" className="mtop waves-effect waves-light blue-grey darken-3 btn mbottom"><i className="material-icons right">add_box</i>New RSVP</Link>
          </div>
          <div className="row">
            <div className="col s10 offset-s1 m8 offset-m2 l6 offset-l3">
              {rsvps}
              {
                !rsvps.length ?
                  <div className="center">
                    <h4>
                      RSVPs you have created will appear on this page.
                    </h4>
                    <img className="responsive-img mtop" src={mail} alt="envelope" />
                  </div>
                  :
                  ""
              }
            </div>
          </div>
        </div>
      );
    }
  }
}
