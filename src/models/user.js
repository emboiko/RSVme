const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RSVP = require("./RSVP");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required."],
    trim: true,
    maxlength: [60, "First name must be 60 characters or less."]
  },
  last_name: {
    type: String,
    required: [true, "Last name is required."],
    trim: true,
    maxlength: [60, "Last name must be 60 characters or less."]
  },
  phone: {
    type: String,
    trim: true,
    validate(phone) {
      if (!phone) return;

      if ((phone.length !== 12) || (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phone))) {
        throw new Error("Invalid Phone");
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: [true, "Email is already in use."],
    validate(email) {
      if (!validator.isEmail(email)) throw new Error("Invalid Email.");
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, "Password must be longer than 7 characters."]
  },
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
}

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.avatar;

  return userObject;
}

userSchema.statics.findByCredentials = async (email, pw) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login.");

  const isMatch = await bcrypt.compare(pw, user.password);
  if (!isMatch) throw new Error("Unable to login.");

  return user;
}

userSchema.virtual("rsvps", {
  ref: "RSVP",
  localField: "_id",
  foreignField: "owner"
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  await RSVP.deleteMany({ owner: this._id });
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
