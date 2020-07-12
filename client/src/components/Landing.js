import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/utils/Footer";
import Sample from "../components/utils/Sample";
import logoFull from "../img/logoFull.png";
import logoName from "../img/logoName.png";
import sample1 from "../img/sample1.jpg";
import sample2 from "../img/sample2.jpg";
import sample3 from "../img/sample3.jpg";
import idea from "../img/idea.png";
import mailbox from "../img/mailbox.png";
import guestList from "../img/guest-list.png";

export default class Landing extends Component {
  componentDidMount = () => document.title = "CraftiCards";

  render() {
    let getStarted;

    if (this.props.user) {
      getStarted = "/dashboard";
    } else {
      getStarted = "/register";
    }

    const samples = [sample1, sample2, sample3].map((sample, i) => {
      return <Sample key={i} img={sample} />
    });

    return (
      <>
        <div className="section no-pad-bot" id="index-banner">
          <div className="container">
            <br /><br />
            <div className="header center hide-on-small-only">
              <img src={logoFull} alt="Crafticards" />
            </div>
            <h1 className="header center hide-on-med-and-up">
              <img src={logoName} alt="Crafticards" />
            </h1>

            <div className="row center">
              <h5 className="header col s12 light">RSVPs and guest-list management for the modern era</h5>
            </div>
            <div className="row center">
              <Link
                to={getStarted}
                className="btn-large waves-effect waves-light blue-grey">
                Get Started
              </Link>
            </div>
            <br /><br />
          </div>
        </div>

        <div className="container">
          <div className="row">
            {samples}
          </div>
        </div>

        <div className="container">
          <div className="section">

            <div className="row">
              <div className="col s12 m4">
                <div className="icon-block">
                  <div className="center">
                    <img className="landing-icon" src={mailbox} alt="" />
                  </div>
                  <h5 className="center">It's a breeze.</h5>

                  <p className="light">Get up and running in moments- it takes only a few seconds to create an account. Compose your RSVP with
                  a single form, and distribute the provided QR-code in whichever way you see fit. Your recipients will
                  love how convenient it is. There's no need to register for an account or install an app in order to
                  accept or decline. Simply scan the code and arrive at the given RSVP's page.</p>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="icon-block">
                  <div className="center">
                    <img className="landing-icon" src={idea} alt="" />
                  </div>
                  <h5 className="center">Simple. Smooth. Straightforward.</h5>

                  <p className="light">CraftiCards removes the hassle of updating and keeping track of who's coming and who's not. We streamline the process with a minimalist interface that's easy for everyone. Creating a new RSVP might take about one minute- replying to one takes about 10 seconds.</p>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="icon-block">
                  <div className="center">
                    <img className="landing-icon" src={guestList} alt="" />
                  </div>
                  <h5 className="center">Get more feedback, faster.</h5>

                  <p className="light">Returning RSVPs in the mail is a drag, and easily forgotten. With our app, you'll never get lost between your guests' mailbox and the countertop. RSVme makes it as easy as possible to create or respond to invitations, giving you time to focus on planning your event instead of updating the guest-list.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </>
    )
  }
}
