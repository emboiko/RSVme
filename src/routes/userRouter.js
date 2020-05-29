const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const noAuth = require("../middleware/noAuth");
const checkUser = require("../middleware/checkUser");
const upload = require("../middleware/multer");
const sharp = require("sharp");
const {welcomeEmail, cancelEmail} = require("../email/email");

const userRouter = new express.Router();

userRouter.get("/",  checkUser, (req, res) => {
    res.render("index", {user: req.user, pageTitle:"RSVme | Home"});
});

//////////////////////

userRouter.get("/users/login", noAuth, (req, res) => {
    res.render("login", {pageTitle:"RSVme | Login", minHeader:true});
});

userRouter.post("/users/login", noAuth, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie("access_token", token, {httpOnly:true});
        res.status(200).redirect("/");
    } catch (err) {
        res.status(400).render("login", {
            error : "Unable to login. Check your credentials and try again.",
            pageTitle : "RSVme | Login",
            minHeader:true
        });
    }
});

userRouter.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        res.clearCookie("access_token");

        await req.user.save();        
        res.redirect("/");
    } catch (err) {
        res.status(500).render("notfound", {pageTitle:"RSVme | 404"});
    }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie("access_token");

        await req.user.save();
        res.redirect("/");
    } catch (err) {
        res.status(500).render("notfound", {pageTitle:"RSVme | 404"});
    }
});

//////////////////////

userRouter.get("/users", noAuth, (req, res) => {
    res.render("register", {pageTitle:"RSVme | Register", minHeader:true});
});

userRouter.post("/users", noAuth, async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        // welcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.cookie("access_token", token, {httpOnly:true});

        res.status(201).render("registerSuccess", {user, pageTitle:"RSVme | Success"});
    } catch (err) {
        res.status(400).render("register", {pageTitle:"RSVme | Register", error: "Email is already registered."});
    } 
});

userRouter.get("/users/me", auth, async (req, res) => {
    res.render("account", {user: req.user, pageTitle:`RSVme | ${req.user.name}`});
});

userRouter.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "phone", "avatar"];
    const valid = updates.every((update) => allowedUpdates.includes(update));

    if (!valid) return res.status(400).render("/users/me", {user: req.user, pageTitle:"RSVme", message: "Invalid Updates"});

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(202).redirect("/users/me");
    } catch (err) {
        res.status(400).render("account", {user:req.user, error: err.message, pageTitle:`RSVme | ${req.user.name}`});
    }
});

userRouter.get("/users/me/delete", auth, async(req, res) => {
    res.render("delete_account", {user: req.user, pageTitle: "RSVme | Delete Account"});
});

userRouter.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        // cancelEmail(req.user.email, req.user.name);
        res.status(200).render("accountDeleteSuccess", {user: req.user, pageTitle: "RSVme"});
    } catch (err) {
        res.status(500).render("notfound", {user: req.user, pageTitle:"RSVme | 404"});
    }
});

//////////////////////

userRouter.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    if (!req.file) {
        return res.render("account", {user:req.user, error: "Please choose a file before uploading.", pageTitle:`RSVme | ${req.user.name}`});
    }
    
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.redirect("/users/me");
}, (err, req, res, next) => {
    res.status(400).render("notfound", {user: req.user, pageTitle:"RSVme | 404"});
});

userRouter.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error();

        res.set("Content-Type", "image/png");
        res.status(200).send(user.avatar);
    } catch (err) {
        res.status(404).render("notfound", {pageTitle:"RSVme | 404"});
    }
});

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send(); // todo
});

module.exports = userRouter;
