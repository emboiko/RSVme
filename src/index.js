const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const methodOverride = require("method-override");
const rsvpRouter = require("./routes/rsvpRouter");
const userRouter = require("./routes/userRouter");
require("./db/mongoose");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://127.0.0.1:1337", //env var in prod
    credentials:true
}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(rsvpRouter);
app.use(userRouter);

app.get("*", (req, res) => {
    res.render("notfound", {pageTitle: "RSVme | 404"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
