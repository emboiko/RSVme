const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {

    try {
        // I still haven't decided how I want to do this. 
        // const token = req.header("Authorization").replace("Bearer ", "");
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

        if (!user) throw new Error();

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).redirect("/users/login");
    }

}

module.exports = auth;
