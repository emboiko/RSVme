const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const noAuth = require("../middleware/noAuth");
const checkUser = require("../middleware/checkUser");
const upload = require("../middleware/multer");
const sharp = require("sharp");
const { welcomeEmail, cancelEmail } = require("../email/email");

const userRouter = new express.Router();

userRouter.get("/", checkUser, (req, res) => {
    res.status(200).render("index", { user: req.user, pageTitle: "RSVme" });
});

userRouter.get("/users/login", noAuth, (req, res) => {
    res.status(200).render("login", { pageTitle: "RSVme | Login", minHeader: true });
});

userRouter.post("/users/login", noAuth, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie("access_token", token, { httpOnly: true });
        res.status(202).redirect("/");
    } catch (err) {
        res.status(400).render("login", {
            error: "Unable to login. Check your credentials and try again.",
            pageTitle: "RSVme | Login",
            minHeader: true
        });
    }
});

userRouter.post("/users/logout", auth, async (req, res) => {
    try {
        res.clearCookie("access_token");
        res.status(202).redirect("/");
    } catch (err) {
        res.status(400).render("notfound", { pageTitle: "RSVme | 404" });
    }
});

userRouter.get("/users", noAuth, (req, res) => {
    res.status(200).render("register", { pageTitle: "RSVme | Register", minHeader: true });
});

userRouter.post("/users", noAuth, async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        // welcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.cookie("access_token", token, { httpOnly: true });

        res.status(201).render("registerSuccess", {
            user,
            pageTitle: "RSVme"
        });
    } catch (err) {
        const index = err.message.lastIndexOf(":");
        let error = err.message.substr(index + 1);

        if (err.code === 11000) {
            error = "Email is already registered."
        }

        res.status(400).render("register", {
            pageTitle: "RSVme | Register",
            error
        });
    }
});

userRouter.get("/users/me", auth, async (req, res) => {
    res.status(200).render("account", {
        user: req.user,
        pageTitle: `RSVme | ${req.user.first_name}`
    });
});

userRouter.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["first_name", "last_name", "email", "password", "phone", "avatar"];
    const valid = updates.every((update) => allowedUpdates.includes(update));

    if (!valid) return res.status(400).render("account", {
        error: "Invalid updates",
        user: req.user,
        pageTitle: "RSVme",
        message: "Invalid Updates"
    });

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(202).redirect("/users/me");
    } catch (err) {
        const index = err.message.lastIndexOf(":");
        const substr = err.message.substr(index + 1);
        res.status(400).render("account", {
            user: req.user,
            error: substr,
            pageTitle: `RSVme | ${req.user.name}`
        });
    }
});

userRouter.get("/users/me/delete", auth, async (req, res) => {
    res.status(200).render("delete_account", {
        user: req.user,
        pageTitle: "RSVme | Delete Account"
    });
});

userRouter.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        // cancelEmail(req.user.email, req.user.name);
        res.status(202).render("accountDeleteSuccess", {
            user: req.user,
            pageTitle: "RSVme"
        });
    } catch (err) {
        res.status(400).render("notfound", {
            user: req.user,
            pageTitle: "RSVme | 404"
        });
    }
});

userRouter.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    if (!req.file) return res.status(400).render("account", {
        user: req.user,
        error: "Please choose a file before uploading.",
        pageTitle: `RSVme | ${req.user.first_name}`
    });


    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.status(202).redirect("/users/me");

}, (err, req, res, next) => {
    const index = err.message.lastIndexOf(":");
    let error = err.message.substr(index + 1);

    res.status(400).render("account", {
        user: req.user,
        error,
        pageTitle: `RSVme | ${req.user.first_name}`
    });
});

//todo
userRouter.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error();

        res.set("Content-Type", "image/png");
        res.status(200).send(user.avatar);
    } catch (err) {
        res.status(404).render("notfound", { pageTitle: "RSVme | 404" });
    }
});

//todo
userRouter.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
});

module.exports = userRouter;
