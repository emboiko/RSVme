import React, { Component } from 'react';

export default class PrivateGuestList extends Component {
  render() {
    const joined = this.props.rsvp.joined.map((party, i) => {
      return (
        <li className="collection-item" key={i}>
          <p>
            Name: {party.party}
            <br />
            Contact: <a href={`mailto:${party.email}`}>{party.email}</a>
            <br />
            Party Size: {party.partySize}
          </p>
        </li>
      );
    });
    const declined = this.props.rsvp.declined.map((party, i) => {
      return (
        <li className="collection-item" key={i}>
          <p>
            Name: {party.party}
            <br />
            Contact: <a href={`mailto:${party.email}`}>{party.email}</a>
          </p>
        </li>
      );
    });
    return (
      <div>
        <h3 className="center">{this.props.rsvp.title}</h3>
        <ul className="collection with-header">
          <li className="collection-header bold">Accepted</li>
          {joined}
        </ul>

        <ul className="collection with-header">
          <li className="collection-header bold">Declined</li>
          {declined}
        </ul>
      </div>
    );
  }
}
