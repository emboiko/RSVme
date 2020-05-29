const jwt = require("jsonwebtoken");
const User = require("../models/user");

const noAuth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (user) res.redirect("/");
    } catch (err) {
        next();
    }
}

module.exports = noAuth;
