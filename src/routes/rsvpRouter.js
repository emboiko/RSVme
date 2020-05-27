const express = require("express");
const QRcode = require("qrcode");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const checkUser = require("../middleware/checkUser");
const RSVP = require("../models/RSVP");
const {acceptEmail, creationEmail} = require("../email/email");

const rsvpRouter = new express.Router();

rsvpRouter.get("/about", checkUser, (req, res) => {
    res.render("about", {user: req.user, pageTitle:"RSVme | About"})
});

rsvpRouter.get("/rsvp", auth, (req, res) => {
    res.render("create_rsvp", {user: req.user, pageTitle:"RSVme | New"})
});

rsvpRouter.post("/rsvp", auth, async (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const qr = await QRcode.toDataURL(`${process.env.URL}/rsvp/${id}`);

    const rsvp = new RSVP({
        ...req.body,
        qr,
        id,
        owner:req.user._id
    });

    try {
        await rsvp.save();
        //creationEmail() //todo
        res.status(201).redirect(`/rsvp/${id}`);
    } catch (err) {
        console.log(err);
        res.status(400).render("notfound", {user: req.user, pageTitle:"RSVme | 404"});
    }
});

rsvpRouter.get("/rsvp/:id", checkUser, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).render("notfound", {user:req.user, pageTitle:"RSVme | 404"});
        res.status(201).render("read_rsvp", {user:req.user, rsvp, pageTitle:rsvp.title});
    } catch (err) {
        res.status(400).render("notfound", {user:req.user, pageTitle:"RSVme | 404"});
    }
});

rsvpRouter.get("/rsvp/:id/qr", checkUser, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id })
        if (!rsvp) return res.status(404).render("notfound", {user:req.user, pageTitle:"RSVme | 404"});
        res.status(201).render("qr", {user: req.user, rsvp, pageTitle: "RSVme"});
    } catch (err) {
        res.status(400).render("notfound", {user:req.user, pageTitle:"RSVme | 404"});
    }
});

rsvpRouter.get("/rsvp/:id/edit", auth, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id, owner:req.user._id });
        if (!rsvp) return res.status(404).send();

        res.status(202).render("edit_rsvp", {
            user: req.user,
            rsvp,
            pageTitle: `RSVme | Edit ${rsvp.title}`
        });
    } catch (err) {
        res.status(400).render("notfound", {user: req.user, pageTitle: "RSVme | 404"});
    }
});

rsvpRouter.patch("/rsvp/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "author",
        "author_email",
        "author_phone",
        "title",
        "description",
        "location",
        "date",
        "time",
    ];

    const valid = updates.every((update) => allowedUpdates.includes(update));
    if (!valid) return res.status(400).send({ error: "Invalid Updates" });

    try {
        const rsvp = await RSVP.findOne({ id: req.params.id, owner:req.user._id });
        if (!rsvp) return res.status(404).send();

        updates.forEach((update) => rsvp[update] = req.body[update]);

        await rsvp.save();
        res.status(202).redirect(`/rsvp/${rsvp.id}`);
    } catch (err) {
        res.status(400).render("notfound", {user: req.user, pageTitle: "RSVme | 404"});
    }

});

rsvpRouter.get("/rsvp/:id/delete", auth, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id, owner:req.user._id });
        if (!rsvp) return res.status(404).send();

        res.status(202).render("delete_rsvp", {
            user: req.user,
            rsvp,
            pageTitle: `RSVme | Delete ${rsvp.title}`
        });
    } catch (err) {
        res.status(400).render("notfound", {user: req.user, pageTitle: "RSVme | 404"});
    }
});

rsvpRouter.delete("/rsvp/:id", auth, async (req, res) => {
    try {
        const rsvp = await RSVP.findOneAndDelete({ id: req.params.id, owner: req.user._id });
        if (!rsvp) return res.status(404).send();

        res.status(200).render("rsvpDeleteSuccess", {user: req.user, pageTitle: "RSVme"});
    } catch (err) {
        res.status(400).render("notfound", {user: req.user, pageTitle:"RSVme | 404"});
    }
});

rsvpRouter.get("/rsvps", auth, async (req, res) => {
    // todo: more optional filtering
    // GET /rsvps?completed=true
    // const match = {};
    // if (req.query.completed) {
    //     match.completed = req.query.completed === "true";
    // }

    // GET /rsvps?sortBy=createdAt:desc
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        await req.user.populate({ //todo
            path: "rsvps",
            //match
            options:{
                // GET /rsvps?sortBy=10&skip=20
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).render("list_rsvp",{user: req.user, rsvps: req.user.rsvps, pageTitle:"RSVme | My RSVPs"});
    } catch (err) {
        console.log(err);
        res.status(500).render("notfound", {pageTitle:"RSVme | 404"});
    }
});

rsvpRouter.post("/rsvp/:id", checkUser, async (req, res) => {
    try {
        const rsvp = await RSVP.findOne({ id: req.params.id });
        if (!rsvp) return res.status(404).send();

        const invalid = rsvp.joined.some((party) => party.email === req.body.email);
        if (invalid) return res.status(400).render(
            `read_rsvp`,
            { 
                user:req.user,
                rsvp,
                pageTitle: `RSVme | ${rsvp.title}`,
                "error": "Email is already registered with this RSVP"
             }
        );

        let joined;

        //todo: check if we're already declined and remove from declined
        if (req.body.accepted === "Accept") {
            rsvp.num_guests += parseInt(req.body.num_guests);
            rsvp.joined = rsvp.joined.concat({ party: req.body.party, email: req.body.email });
            joined = true;

            //todo: probably include the party name, QR + RSVP ID in the email, too.
            // acceptEmail(
            //     req.body.email,
            //     rsvp.author_email,
            //     rsvp.author_phone,
            //     rsvp.title,
            //     rsvp.description,
            //     rsvp.location,
            //     rsvp.date,
            //     rsvp.time,
            // );
        } else {
            rsvp.declined = rsvp.declined.concat({ party: req.body.party, email: req.body.email });
            joined = false;
        }

        await rsvp.save();
        res.status(201).render(
            "submitted", 
            {
                user: req.user,
                rsvp,
                pageTitle:`RSVme | ${joined === true ? "Accepted": "Declined."}`,
                joined
            }
        );
    } catch (err) {
        console.log(err);
        res.status(400).render("notfound", {pageTitle:"RSVme | 404"});
    }
});

module.exports = rsvpRouter;
