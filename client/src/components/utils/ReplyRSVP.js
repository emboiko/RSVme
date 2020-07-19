import React, { Component } from 'react';
import axios from "axios";

export default class ReplyRSVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      party: "",
      partySize: 1,
      email: "",
      pin: "",
      message: "",
      submitted: false,
      accepted: ""
    };
  }

  handleChange = (e) => {
    switch (e.target.name) {
      case "pin":
        this.setState({ pin: e.target.value.toUpperCase() });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleClick = (e) => {
    e.persist();
    this.handleSubmit(e);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ message: "" });
    if (e.target.parentNode.checkValidity()) {
      const { party, partySize, email, pin } = this.state;
      try {
        const res = await axios.post(
          `/rsvp/${this.props.id}`,
          {
            accepted: e.target.value,
            party,
            partySize,
            email,
            pin
          });

        if (res.status === 201) {
          this.setState({ submitted: true, accepted: e.target.value });
        }

        if (res.status === 200) {
          this.setState({ message: res.data.error });
        }
      } catch (err) {
        this.setState({ message: "Server Error." });
      }
    } else {
      this.setState({ message: "Please fill out all form fields completely." });
    }
  }

  render() {
    if (this.state.submitted) {
      return (
        <>
          <h4>Submitted</h4>
          {
            this.state.accepted === "Accept" ?
              <h6>You've successfully accepted this RSVP. <i className="material-icons">check</i></h6>
              :
              <h6>You've successfully declined this RSVP. <i className="material-icons">close</i></h6>
          }
        </>
      )
    } else {
      return (
        <div className="row">
          <div className="col s10 offset-s1 m8 offset-m2 l6 offset-l3">
            <p className="error bold">
              {this.state.message}
            </p>
            <form onSubmit={this.handleSubmit}>
              <div className="input-field">
                <label htmlFor="party">*Party Name:</label>
                <br />
                <input
                  type="text"
                  name="party"
                  value={this.state.party}
                  onChange={this.handleChange}
                  className="center"
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="email">*Email:</label>
                <br />
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  className="center"
                  required
                />
              </div>

              <div className="row">
                <div className="input-field col s6 offset-s3">
                  <label htmlFor="partySize">*Guests in party:</label>
                  <br />
                  <input
                    type="number"
                    name="partySize"
                    min="1"
                    onChange={this.handleChange}
                    value={this.state.partySize}
                    className="center"
                    required
                  />
                  {
                    this.props.pin ?
                      <div className="input-field">
                        <label htmlFor="pin">*PIN:</label>
                        <br />
                        <input
                          type="text"
                          name="pin"
                          id="pin"
                          onChange={this.handleChange}
                          value={this.state.pin}
                          className="center"
                          required
                        />
                      </div>
                      :
                      ""
                  }
                </div>
              </div>

              <input
                className="btn blue-grey darken-3 submit mright"
                type="submit"
                name="accepted"
                value="Accept"
                onClick={this.handleClick}
              />
              <input
                className="btn red submit mleft "
                type="submit"
                name="accepted"
                value="Decline"
                onClick={this.handleClick}
              />
            </form>
          </div>
        </div>
      );
    }
  }
}
