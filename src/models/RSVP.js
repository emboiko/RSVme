const mongoose = require("mongoose");
const validator = require("validator");

const RSVP_Schema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    author_email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    author_phone: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: Buffer
    },
    qr: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    num_guests: {
        type: Number,
        default: 0
    },
    joined: [{
        party: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate(email) {
                if (!validator.isEmail(email)) throw new Error("Invalid Email.");
            }
        }
    }],
    declined: [{
        party: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate(email) {
                if (!validator.isEmail(email)) throw new Error("Invalid Email.");
            }
        }
    }]
}, {
    timestamps: true
});

const RSVP = mongoose.model("RSVP", RSVP_Schema);

module.exports = RSVP;