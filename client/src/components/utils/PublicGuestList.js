import React, { Component } from 'react';

export default class PublicGuestList extends Component {
  render() {
    const joined = this.props.joined.map((party, i) => {
      return <li className="collection-item blue-grey darken-3 white-text" key={i}>{party.party}</li>
    });

    return (
      <div className={joined.length ? "" : "hide"}>
        <ul className="collection">
          <li className="collection-header">
            <h5>Attending</h5>
          </li>
          {joined}
        </ul>
      </div>
    );
  }
}
