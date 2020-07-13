import React, { Component } from 'react';
import axios from "axios";

export default class CreateRSVP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: "",
      author_email: "",
      author_phone: "",
      title: "",
      description: "",
      img: undefined,
      location: "",
      date: "",
      rsvp_by: "",
      time: "",
      end_time: "",
      pin: "",
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ message: "" });

    try {
      const formData = new FormData();
      for (let prop in this.state) {
        formData.append(prop, this.state[prop]);
      }

      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      }

      const res = await axios.post("/rsvp", formData, config);
      if (res.status === 201) {
        this.props.history.push(`/cc/${res.data.id}`);
      } else {
        const messages = Object.values(res.data);
        const message = messages.map((message, i) => {
          return <li key={i}>{message}</li>
        });
        this.setState({ message });
      }
    } catch (err) {
      this.setState({
        message: "Invalid image: Max file size 1MB | Format .PNG or .JPG"
      });
    }
  }

  handleChange = (e) => {
    switch (e.target.name) {
      case "img":
        this.setState({ img: e.target.files[0] });
        break;
      case "pin":
        this.setState({ pin: e.target.value.toUpperCase() });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleKeyPress = (e) => {
    let val = e.target.value.replace(/[^\d\b-]/g, "");
    if (val.length === 3 && (e.data !== null)) val += "-";
    if (val.length === 7 && (e.data !== null)) val += "-";
    this.setState({ [e.target.name]: val });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="center">
            <h2 >New RSVP</h2>
            <ul className="error">
              {this.state.message}
            </ul>

          </div>

          <form
            className="col s10 offset-s1 m8 offset-m2 l6 offset-l3"
            encType="multipart/form-data"
            onSubmit={this.handleSubmit}
          >

            <p className="center bold">Who:</p>

            <div className="input-field">
              <label htmlFor="author">*Author/Host</label>
              <br />
              <input
                type="text"
                name="author"
                className="center"
                value={this.state.author}
                onChange={this.handleChange}
                required />
            </div>
            <div className="input-field">
              <label htmlFor="author_email">*Contact Email</label>
              <br />
              <input
                type="email"
                name="author_email"
                className="center"
                value={this.state.author_email}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="author_phone">Contact Phone <small>(Format: 123-456-7890)</small></label>
              <br />
              <input
                type="tel"
                className="center"
                name="author_phone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                value={this.state.author_phone}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
            </div>

            <p className="center bold">What:</p>

            <div className="input-field">
              <label htmlFor="title">*Title</label>
              <br />
              <input
                type="text"
                name="title"
                className="center"
                value={this.state.title}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="description">Description</label>
              <br />
              <br />
              <textarea
                type="text"
                name="description"
                className="description"
                value={this.state.description}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div className="center">
              <p>Include an image (jpg/png)</p>
              <p>Max file size 1MB | Format .PNG or .JPG</p>
              <input
                type="file"
                accept=".jpeg,.jpg,.png"
                name="img"
                onChange={this.handleChange}
              />

              <p className="bold">Where:</p>
            </div>

            <div className="input-field">
              <label htmlFor="location">*Location/Address</label>
              <br />
              <input
                type="text"
                name="location"
                className="center"
                value={this.state.location}
                onChange={this.handleChange}
                required
              />
            </div>

            <p className="center bold">When:</p>
            <div className="col s6 ">

              <div className="input-field">
                <label htmlFor="date">*Date</label>
                <br />
                <input
                  className="center"
                  type="date"
                  name="date"
                  value={this.state.date} required
                  onChange={this.handleChange}
                />
              </div>

              <div className="input-field">
                <label htmlFor="rsvp_by">*RSVP By Date</label>
                <br />
                <input
                  className="center"
                  type="date"
                  name="rsvp_by"
                  value={this.state.rsvp_by}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>
            <div className="col s6 ">

              <div className="input-field">
                <label htmlFor="time">*Start Time</label>
                <br />
                <input
                  className="center"
                  type="time"
                  name="time"
                  value={this.state.time}
                  onChange={this.handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label htmlFor="end_time">End Time</label>
                <br />
                <input
                  className="center"
                  type="time"
                  name="end_time"
                  value={this.state.end_time}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="col s8 offset-s2 center">
              <div className="input-field">
                <p>Protect this RSVP with an optional PIN</p>
                <small >Don't forget to provide this to your guests!</small>
                <input
                  type="text"
                  name="pin"
                  value={this.state.pin}
                  onChange={this.handleChange}
                  className="pin-input"
                />
              </div>

              <button className="btn blue-grey darken-3">Submit</button>
            </div>

          </form>
        </div>
      </div>
    );
  }
}
