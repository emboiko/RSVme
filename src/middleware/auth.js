const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) throw new Error();

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.redirect(401, "/users/login");
    }
}

module.exports = auth;
