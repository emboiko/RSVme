const express = require("express");
const helmet = require("helmet");
const rsvpRouter = require("./routes/rsvpRouter");
require("./db/mongoose");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(rsvpRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
