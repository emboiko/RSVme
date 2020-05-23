const express = require("express");
const rsvpRouter = new express.Router();

rsvpRouter.post("/rsvp/:id", (req, res) => {
    //Create an RSVP event
    //Create a unique ID, store in DB
    //Create a QR code, encode URL for RSVP
});
rsvpRouter.get("/rsvp/:id", (req, res) => {
    //Get the RSVP event
    //Get RSVP details
    //Title
    //Description
    //Location, Date, Time
    //Get RSVPers
});
rsvpRouter.patch("/rsvp/:id", (req, res) => {
    //Edit RSVP details
});
rsvpRouter.delete("/rsvp/:id", (req, res) => {
    //Delete RSVP => Automatic after event date expires or nanually
});

rsvpRouter.post("/rsvp/:id/accept", () => {
    //Get the recipient's name / party name
    //Add users to list of accepted people
});
rsvpRouter.post("/rsvp/:id/decline", () => {
    //yadayada
});

module.exports = rsvpRouter;
