import React, { Component } from 'react';

export default class Sample extends Component {
  render() {
    return (
      <div className="col m4">
        <div className="card">
          <div className="card-image">
            <img src={this.props.img} alt="Crafticards sample RSVP card" />
          </div>
        </div>
      </div>
    );
  }
}
