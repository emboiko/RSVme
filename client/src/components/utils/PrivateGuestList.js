import React, { Component } from 'react';

export default class PrivateGuestList extends Component {
  render() {
    const joined = this.props.rsvp.joined.map((party, i) => {
      return (
        <li className="collection-item" key={i}>
          <p>
            <i className="material-icons">person</i>
            &emsp;
            Name: {party.party}
            <br />
            <i className="material-icons">email</i>
            &emsp;
            Contact: <a href={`mailto:${party.email}`}>{party.email}</a>
            <br />
            <i className="material-icons">people</i>
            &emsp;
            Party Size: {party.partySize}
          </p>
        </li>
      );
    });
    const declined = this.props.rsvp.declined.map((party, i) => {
      return (
        <li className="collection-item" key={i}>
          <p>
            <i className="material-icons">person</i>
            Name: {party.party}
            <br />
            <i className="material-icons">email</i>
            Contact: <a href={`mailto:${party.email}`}>{party.email}</a>
          </p>
        </li>
      );
    });
    return (
      <div>
        <h3 className="center">{this.props.rsvp.title}</h3>
        <hr />
        <h6 className="inline">
          {this.props.rsvp.joined.length} parties registered
          |&nbsp;
          {this.props.rsvp.numGuests} total guests.
        </h6>
        <small className="right inline hide-on-small-only">
          {new Date(this.props.rsvp.date).toLocaleDateString("en-US", {
            timeZone: "UTC",
            day: "numeric",
            weekday: "long",
            month: "long",
            year: "numeric"
          })}
        </small>
        <ul className="collection with-header">
          <li className="collection-header bold">Accepted</li>
          {joined}
        </ul>

        <h5>
          {this.props.rsvp.declined.length} parties declined
        </h5>
        <ul className="collection with-header">
          <li className="collection-header bold">Declined</li>
          {declined}
        </ul>
      </div>
    );
  }
}
