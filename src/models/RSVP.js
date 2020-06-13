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
        trim: true,
        validate(author_phone) {
            if ((author_phone.length !== 12) || (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(author_phone))) {
                throw new Error("Invalid Phone");
            }
        }
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
        type: Date,
        required: true,
        trim: true,
        validate(date) {
            const today = new Date(Date.now());
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);

            if (date < today) {
                throw new Error("RSVP Date has already passed.");
            }
        }
    },
    rsvp_by: {
        type: Date,
        required: true,
        trim: true,
        validate(rsvp_by) {
            const today = new Date(Date.now());
            today.setUTCHours(0);
            today.setUTCMinutes(0);
            today.setUTCSeconds(0);
            today.setUTCMilliseconds(0);

            if (rsvp_by < today) {
                throw new Error("RSVP By Date has already passed.");
            }

            if (rsvp_by > this.date) {
                throw new Error("RSVP By Date must come before RSVP Date.");
            }
        }
    },
    time: {
        type: String,
        required: true,
        trim: true,
        validate(time) {
            if (!/\d{2}:\d{2}/.test(time)) {
                throw new Error("Invalid Start Time");
            }
        }
    },
    end_time: {
        type: String,
        trim: true,
        validate(time) {
            if (!time) return;

            if (!/\d{2}:\d{2}/.test(time)) {
                throw new Error("Invalid End Time");
            }
        }
    },
    expire: {
        type: Boolean,
        required: true
    },
    img: {
        type: Buffer
    },
    pin: {
        type: String,
        uppercase: true,
        trim: true
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
        party_size: {
            type: Number,
            required: true
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
