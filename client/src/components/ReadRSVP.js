import React, { Component } from 'react';
import axios from 'axios';
import Loading from "./utils/Loading";
import ReplyRSVP from "./utils/ReplyRSVP";
import PublicGuestList from "./utils/PublicGuestList";
import favicon from "../img/favicon.png";
import M from "materialize-css";

export default class ReadRSVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      location: "",
      date: "",
      rsvpBy: "",
      time: "",
      endTime: "",
      author: "",
      authorEmail: "",
      authorPhone: "",
      pin: "",
      img: "",
      id: "",
      joined: ""
    }
  }

  componentDidMount = async () => {
    let res;
    try {
      res = await axios.get(`/rsvp/${this.props.match.params.id}`);
    } catch (err) {
      this.props.history.push("/not_found");
    }
    this.setState({
      title: res.data.title,
      description: res.data.description,
      location: res.data.location,
      date: res.data.date,
      rsvpBy: res.data.rsvpBy,
      time: res.data.time,
      endTime: res.data.endTime,
      author: res.data.author,
      authorEmail: res.data.authorEmail,
      authorPhone: res.data.authorPhone,
      pin: res.data.pin,
      id: res.data.id,
      qr: res.data.qr,
      numGuests: res.data.numGuests,
      joined: res.data.joined,
    });
    this.setState({
      img: `/rsvp/${this.state.id}/img?` + new Date().getTime()
    });

    M.Collapsible.init(document.querySelectorAll('.collapsible'));

    document.title = `CraftiCards | ${this.state.title}`;
    window.scrollTo(0, 0);
  }

  handleBrokenImage = (e) => {
    e.target.src = favicon;
  }

  render() {
    if (!this.state.id) {
      return (
        <div className="container">
          <Loading />
        </div>
      );
    } else {
      const options = {
        timeZone: 'UTC',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric'
      }

      const date = new Date(this.state.date);
      const dateDisplay = <p>
        {date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          day: "numeric",
          weekday: "long",
          month: "long",
          year: "numeric"
        })}
      </p>

      const timeDisplay = <p >
        {
          new Date('1970-01-01T' + this.state.time + 'Z')
            .toLocaleTimeString({}, options)
        }

        {
          this.state.endTime ?
            " - " + new Date('1970-01-01T' + this.state.endTime + 'Z')
              .toLocaleTimeString({}, options)
            :
            ""
        }
      </p>

      const rsvpBy = new Date(this.state.rsvpBy);
      const rsvpByDisplay = <small>RSVP by:<br />
        {rsvpBy.getUTCMonth() + 1}
        /
        {rsvpBy.getUTCDate()}
        /
        {rsvpBy.getUTCFullYear()}
      </small>


      return (
        <div className="container center">


          <div className="row">
            <div className="col s10 offset-s1 m8 offset-m2 l6 offset-l3">
              <div className="card-panel blue-grey darken-3 white-text">
                <h4>
                  {this.state.title}
                </h4>
              </div>
              <img className="mbottom rsvp-img" onError={this.handleBrokenImage} src={this.state.img} alt="rsvp" />
              <ul className="collapsible popout mtop">
                <li className="active">
                  <div className="collapsible-header blue-grey darken-3 white-text"><i className="material-icons">description</i>Description / Contact</div>
                  <div className="collapsible-body">
                    <p className="rsvp-desc">
                      {this.state.description}
                    </p>
                    {this.state.description ? <hr /> : ""}
                    <p className="bold">
                      {this.state.author}
                      <br />
                      {this.state.authorEmail}
                      <br />
                      {this.state.authorPhone}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="collapsible-header blue-grey darken-3 white-text"><i className="material-icons">place</i>Where / When</div>
                  <div className="collapsible-body">
                    <div className="bold">
                      <p>
                        {this.state.location}
                      </p>
                      {dateDisplay}

                      {timeDisplay}

                      {rsvpByDisplay}
                    </div>

                  </div>
                </li>
                <li>
                  <div className="collapsible-header blue-grey darken-3 white-text"><i className="material-icons">people_outline</i>Guests</div>
                  <div className="collapsible-body">
                    <h5>
                      {this.state.joined.length} parties registered
                      |&nbsp;
                      {this.state.numGuests} total guests.
                    </h5>

                    <div className="row">
                      <div className="col s12">
                        <PublicGuestList joined={this.state.joined} />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>


          <ReplyRSVP
            id={this.state.id}
            pin={this.state.pin}
            history={this.props.history}
          />
        </div>
      );
    }
  }
}
