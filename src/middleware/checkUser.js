const jwt = require("jsonwebtoken");
const User = require("../models/user");

const checkUser = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id});
    
        if (user) {
            req.token = token;
            req.user = user;
        }
    } catch (err) {
        req.token = null;
        req.user = null; 
    }

    next();
}


module.exports = checkUser;