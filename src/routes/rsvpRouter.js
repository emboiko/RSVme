const express = require("express");
const QRcode = require("qrcode");
const mongoose = require("mongoose");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const checkUser = require("../middleware/checkUser");
const upload = require("../middleware/multer");
const RSVP = require("../models/RSVP");
const { acceptEmail } = require("../email/email");

const rsvpRouter = new express.Router();

rsvpRouter.get("/about", checkUser, (req, res) => {
    res.status(200).render("about", { user: req.user, pageTitle: "RSVme | About" });
});

rsvpRouter.get("/rsvp", auth, (req, res) => {
    res.status(200).render("create_rsvp", { user: req.user, pageTitle: "RSVme | New RSVP" });
});

rsvpRouter.post("/rsvp", auth, upload.single("rsvp-img"), async (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const qr = await QRcode.toDataURL(`${process.env.URL}/rsvp/${id}`);

    let buffer;
    if (req.file) {
        buffer = await sharp(req.file.buffer)
            .resize({ width: 500, height: 500 })
            .png()
            .toBuffer();
    }

    if (req.body.expire) {
        req.body.expire = true;
    } else {
        req.body.expire = false;
    }

    req.body.date = new Date(req.body.date);
    req.body.rsvp_by = new Date(req.body.rsvp_by);

    const rsvp = new RSVP({
        ...req.body,
        qr,
        id,
        owner: req.user._id,
        img: buffer
    });

    try {
        await rsvp.save();
        res.redirect(`/rsvp/${id}`);
    } catch (err) {
        res.status(400).render("create_rsvp", {
            user: req.user,
            pageTitle: "RSVme | New RSVP",
            error: err.message
        });
    }
});

rsvpRouter.get("/rsvp/:id", checkUser, async (req, res) => {
    const rsvp = await RSVP.findOne({ id: req.params.id });
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.status(200).render("read_rsvp", {
        user: req.user, rsvp,
        pageTitle: `RSVme | ${rsvp.title}`
    });
});

rsvpRouter.get("/rsvp/:id/joined", auth, async (req, res) => {
    const rsvp = await RSVP.findOne({ id: req.params.id, owner: req.user._id });
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.status(200).render("read_rsvp_guests", {
        user: req.user,
        rsvp,
        pageTitle: "RSVme | Guest-list"
    });
});

rsvpRouter.get("/rsvp/:id/qr", checkUser, async (req, res) => {
    const rsvp = await RSVP.findOne({ id: req.params.id })
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.status(200).render("qr", {
        user: req.user,
        rsvp,
        pageTitle: `RSVme | ${rsvp.title}`
    });
});

rsvpRouter.get("/rsvp/:id/img", checkUser, async (req, res) => {
    const rsvp = await RSVP.findOne({ id: req.params.id })
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.set("Content-Type", "image/png");
    res.status(200).send(rsvp.img);
});

rsvpRouter.get("/rsvp/:id/edit", auth, async (req, res) => {
    const rsvp = await RSVP.findOne({ id: req.params.id, owner: req.user._id });
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.url
    });

    res.status(200).render("edit_rsvp", {
        user: req.user,
        rsvp,
        pageTitle: `RSVme | Edit ${rsvp.title}`
    });
});

rsvpRouter.patch("/rsvp/:id", auth, upload.single("rsvp-img"), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "author",
        "author_email",
        "author_phone",
        "title",
        "description",
        "location",
        "date",
        "rsvp_by",
        "time",
        "end_time",
        "rsvp-img",
        "pin",
        "expire"
    ];

    const rsvp = await RSVP.findOne({ id: req.params.id, owner: req.user._id });
    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) return res.status(400).render("edit_rsvp", {
        error: "Invalid updates",
        user: req.user,
        rsvp,
        pageTitle: `RSVme | Edit ${rsvp.title}`
    });

    try {
        updates.forEach((update) => rsvp[update] = req.body[update]);

        if (req.file) {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 500, height: 500 })
                .png()
                .toBuffer();

            rsvp.img = buffer;
        }

        if (typeof req.body.expire === "undefined") rsvp.expire = false;

        await rsvp.save();
        res.redirect(`/rsvp/${rsvp.id}`);
    } catch (err) {
        const index = err.message.lastIndexOf(":");
        let error = err.message.substr(index + 1);

        res.status(400).render("edit_rsvp", {
            error,
            user: req.user,
            rsvp,
            pageTitle: `RSVme | Edit ${rsvp.title}`
        });
    }

});

rsvpRouter.get("/rsvp/:id/delete", auth, async (req, res) => {
    const rsvp = await RSVP.findOne({
        id: req.params.id,
        owner: req.user._id
    });

    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.status(200).render("delete_rsvp", {
        user: req.user,
        rsvp,
        pageTitle: `RSVme | Delete ${rsvp.title}`
    });
});

rsvpRouter.delete("/rsvp/:id", auth, async (req, res) => {
    const rsvp = await RSVP.findOneAndDelete({
        id: req.params.id,
        owner: req.user._id
    });

    if (!rsvp) return res.status(404).render("notfound", {
        user: req.user,
        pageTitle: "RSVme | 404",
        url: process.env.URL
    });

    res.redirect("/rsvps");
});

rsvpRouter.get("/rsvps", auth, async (req, res) => {
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: "rsvps",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.status(200).render("list_rsvp", {
            user: req.user,
            rsvps: req.user.rsvps,
            pageTitle: "RSVme | My RSVPs",
            sort
        });
    } catch (err) {
        res.status(400).render("notfound", {
            user: req.user,
            pageTitle: "RSVme | 404",
            url: process.env.URL
        });
    }
});

rsvpRouter.post("/rsvp/:id", checkUser, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id });
        if (!rsvp) return res.status(404).render("notfound", {
            user: req.user,
            pageTitle: "RSVme | 404",
            url: process.env.URL
        });

        let error;

        let invalidPin;
        if (rsvp.pin) {
            invalidPin = rsvp.pin !== req.body.pin.toUpperCase();
            if (invalidPin) error = "Invalid PIN";
        } else {
            invalidPin = false;
        }

        const invalidEmail = rsvp.joined.some((party) => party.email === req.body.email);
        if (invalidEmail) error = "Invalid Email";

        const today = new Date(Date.now());
        today.setUTCHours(0);
        today.setUTCMinutes(0);
        today.setUTCSeconds(0);
        today.setUTCMilliseconds(0);
        let invalidDate = today > rsvp.rsvp_by;
        if (invalidDate) error = "RSVP By Date has already passed."

        if (invalidPin || invalidEmail || invalidDate) {
            return res.status(400).render("read_rsvp", {
                user: req.user,
                rsvp,
                pageTitle: `RSVme | ${rsvp.title}`,
                error
            });
        }

        let joined;
        if (req.body.accepted === "Accept") {
            rsvp.num_guests += parseInt(req.body.party_size);
            rsvp.joined = rsvp.joined.concat({
                party: req.body.party,
                party_size: req.body.party_size,
                email: req.body.email
            });
            joined = true;

            acceptEmail(
                req.body.email,
                rsvp.author_email,
                rsvp.author_phone,
                rsvp.title,
                rsvp.description,
                rsvp.location,
                rsvp.date,
                rsvp.time,
                rsvp.end_time,
                rsvp.id
            );
        } else {
            rsvp.declined = rsvp.declined.concat({
                party: req.body.party,
                email: req.body.email
            });
            joined = false;
        }

        await rsvp.save();
        res.status(201).render("submitted", {
            user: req.user,
            rsvp,
            pageTitle: `RSVme | ${joined === true ? "Accepted" : "Declined."}`,
            joined,
            url: process.env.URL
        });
    } catch (err) {
        res.status(400).render("notfound", {
            user: req.user,
            pageTitle: "RSVme | 404",
            url: process.env.URL
        });
    }
});

module.exports = rsvpRouter;
