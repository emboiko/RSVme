const jwt = require("jsonwebtoken");
const User = require("../models/user");

const noAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (user) {
      res.send(user);
    } else {
      next();
    }

  } catch (err) {
    next();
  }
}

module.exports = noAuth;
