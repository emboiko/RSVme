const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {welcomeEmail, cancelEmail} = require("../email/email");

const userRouter = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
            cb(new Error("Please upload an image (jpg/png)"));
        }

        cb(undefined, true);
    }
});

userRouter.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(400).send({ "Error" : err.message });
    }
});

userRouter.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        // welcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

userRouter.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

userRouter.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const valid = updates.every((update) => allowedUpdates.includes(update));

    if (!valid) return res.status(400).send({ error: "Invalid Updates" });

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(202).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

userRouter.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        // cancelEmail(req.user.email, req.user.name);
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
});

userRouter.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message });
});

userRouter.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error();

        res.set("Content-Type", "image/png");
        res.status(200).send(user.avatar);
    } catch (err) {
        res.status(404).send();
    }
});

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
});

module.exports = userRouter;
