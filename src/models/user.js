const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RSVP = require("./RSVP");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(email) {
            if (!validator.isEmail(email)) throw new Error("Invalid Email.");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//user instance
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

//User
userSchema.statics.findByCredentials = async (email, pw) => {
    const user = await User.findOne({email});
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
    const user = this;
    await RSVP.deleteMany({ owner: user._id });

    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
