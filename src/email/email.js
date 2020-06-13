const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const acceptEmail = (
    party_email,
    rsvp_author_email,
    rsvp_author_phone,
    rsvp_title,
    rsvp_description,
    rsvp_location,
    rsvp_date,
    rsvp_time,
    rsvp_end_time,
    rsvp_id
) => {
    let msg = "";

    msg += `${rsvp_description}\n\n`;
    msg += `${rsvp_location}\n`;
    if (rsvp_author_phone) {
        msg += `${rsvp_author_phone}\n`;
    }
    msg += (rsvp_date.getUTCMonth() + 1) + "/";
    msg += rsvp_date.getUTCDate() + "/";
    msg += rsvp_date.getUTCFullYear() + "\n";
    msg += new Date('1970-01-01T' + rsvp_time + 'Z').toLocaleTimeString({}, { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });

    if (rsvp_end_time) {
        msg += " - ";
        msg += new Date('1970-01-01T' + rsvp_end_time + 'Z').toLocaleTimeString({}, { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
        msg += "\n\n";
    } else {
        msg += "\n\n";
    }

    msg += `${process.env.URL}/rsvp/${rsvp_id}`

    sgMail.send({
        to: party_email,
        from: rsvp_author_email,
        subject: `RSVP for ${rsvp_title} registered.`,
        text: msg
    });
}

const welcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "no_reply@RSVme.com",
        subject: "Welcome to RSVme",
        text: `Thanks for joining, ${name}. Your account has been successfully created.`
    });
}

const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "no_reply@RSVme.com",
        subject: `Sorry to see you go, ${name}`,
        text: "Your account and any RSVPs you have created have been successfully deleted. We hope to see you back sometime soon."
    });
}

module.exports = { welcomeEmail, cancelEmail, acceptEmail };
