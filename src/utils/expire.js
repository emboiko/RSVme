const RSVP = require("../models/RSVP");

// https://devcenter.heroku.com/articles/dynos#restarting
// "Dynos are also restarted (cycled) at least once per day."
// "The cycling happens once every 24 hours (plus up to 216 random minutes)"
// Initial plan was to use node-schedule and run every day @ midnight
// For now, we'll expire RSVPs on any given `heroku ps:restart` after they're a day old
const removeExpiredRSVPs = async () => {
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  yesterday.setUTCHours(0);
  yesterday.setUTCMinutes(0);
  yesterday.setUTCSeconds(0);
  yesterday.setUTCMilliseconds(0);

  const expiredRSVPs = await RSVP.find({ date: { $lte: yesterday }, expire: true });
  expiredRSVPs.forEach((expiredRSVP) => {
    console.log("Expiring: ", expiredRSVP.id, expiredRSVP.title, expiredRSVP.date);
    expiredRSVP.remove();
  });
}

module.exports = removeExpiredRSVPs;
