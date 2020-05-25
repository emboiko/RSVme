const express = require("express");
const QRcode = require("qrcode");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const RSVP = require("../models/RSVP");
const {acceptEmail} = require("../email/Email");

const rsvpRouter = new express.Router();

rsvpRouter.get("/", (req, res) => {
    res.status(200).redirect(`http://127.0.0.1:1337`);
});

rsvpRouter.post("/rsvp", auth, async (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const qr = await QRcode.toDataURL(`localhost:3000/rsvp/${id}`); //todo

    const rsvp = new RSVP({
        ...req.body,
        qr,
        id,
        owner:req.user._id
    });

    try {
        await rsvp.save();
        //creationEmail() //todo
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send(err);
    }
});

rsvpRouter.get("/rsvp/:id", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).send();
        res.status(201).send(rsvp);
    } catch (err) {
        res.status(400).send();
    }
});

rsvpRouter.patch("/rsvp/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "location",
        "time",
        "date",
        "description",
        "title",
        "author_phone",
        "author_email",
        "author",
    ];

    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) return res.status(400).send({ error: "Invalid Updates" });

    try {
        const rsvp = await RSVP.findOne({ id: req.params.id, owner:req.user._id });
        if (!rsvp) return res.status(404).send();

        updates.forEach((update) => rsvp[update] = req.body[update]);

        await rsvp.save();
        res.status(202).send(rsvp);
    } catch (err) {
        res.status(400).send(err)
    }

});

rsvpRouter.delete("/rsvp/:id", auth, async (req, res) => {
    try {
        const rsvp = await RSVP.findOneAndDelete({ id: req.params.id, owner: req.user._id });
        if (!rsvp) return res.status(404).send();

        res.status(200).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

rsvpRouter.get("/rsvps", auth, async (req, res) => {
    // const match = {};
    // if (req.query.completed) {
    //     match.completed = req.query.completed === "true";
    // }

    // const sort = {};
    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(":");
    //     sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    // }

    // {
    //     path: "rsvps",
    //     match,
    //     options:{
    //         limit: parseInt(req.query.limit),
    //         skip: parseInt(req.query.skip),
    //         sort
    //     }
    // }

    try {
        await req.user.populate({ //todo
            path: "rsvps",
        }).execPopulate()
        res.status(200).send(req.user.rsvps);
    } catch (err) {
        res.status(500).send(err);
    }
});

rsvpRouter.post("/rsvp/:id", async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).send();

        const invalid = rsvp.joined.some((party) => {
            return party.email === req.body.email;
        });

        if (invalid) {
            return res.status(400).send({ "Error": "Already Registered" });
        }

        //todo: check if we're already declined and remove from declined
        if (req.body.accepted) {
            rsvp.num_guests += req.body.num_guests;
            rsvp.joined = rsvp.joined.concat({ party: req.body.party, email: req.body.email });

            //todo: probably include the QR + RSVP ID in the email, too.
            acceptEmail(
                req.body.email,
                rsvp.author_email,
                rsvp.author_phone,
                rsvp.title,
                rsvp.description,
                rsvp.location,
                rsvp.date,
                rsvp.time,
            );
        } else {
            rsvp.declined = rsvp.declined.concat({ party: req.body.party, email: req.body.email });
        }

        await rsvp.save();
        res.status(201).send();
    } catch (err) {
        res.status(400).send();
    }
});

module.exports = rsvpRouter;
