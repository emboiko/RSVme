const express = require("express");
const frontRouter = new express.Router();

frontRouter.get("/", (req, res) => {
    res.render("index");
});

module.exports = frontRouter;
