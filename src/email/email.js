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
) => {
    let msg = "";

    msg += `${rsvp_description}\n\n`;
    msg += `${rsvp_location}\n`;
    msg += `${rsvp_date}\n`;
    msg += `${rsvp_time}\n`;

    if (rsvp_author_phone) {
        msg += `\nPhone: ${rsvp_author_phone}\n`;
    }

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
        from: "admin@RSVme.com",
        subject: "Welcome to RSVme",
        text: `Thanks for joining, ${name}. Your account has been successfully created.`
    });
}

const cancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "admin@RSVme.com",
        subject: `Sorry to see you go, ${name}`,
        text: "Your account has been successfully deleted. We hope to see you back sometime soon."
    });
}

module.exports = {welcomeEmail, cancelEmail, acceptEmail};
