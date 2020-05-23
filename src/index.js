const express = require("express");
const helmet = require("helmet");
const rsvpRouter = require("./routes/rsvpRouter");
const frontRouter = require("./routes/frontRouter");
require("./db/mongoose");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(rsvpRouter);
app.use(frontRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// QR
// Authentication / middleware
// Sample Front-end
// Landing Page / Dev Page / Documentation
