/* BCIT SSD NodeJS Project 2022
   A01032088 Byul Kim */

"use strict";
console.log("see changes");
// import
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// DB
const mongoose = require("mongoose");
const uri = "mongodb+srv://caxbelle:UfFX1tcO8sE4Qwrw@ssd-0.vfopyf9.mongodb.net/practice?retryWrites=true&w=majority";
mongoose.connect(uri, {
  dbName: "yearBook",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", function () {
  console.log(":: Connected to Mongo");
});
db.on("error", console.error.bind(console, ":: MongoDB connection error:"));

// Server
const app = express();

// Session, Mongo DB
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: uri, //reusing uri from above
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  require("express-session")({
    secret: "a long time ago in a galaxy far far away",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 20 }, // 20 minutes
    store: store,
  })
);

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// Cors
app.use(cors({ origin: [/127.0.0.1*/, /localhost*/] }));

// Express fileupload
app.use(fileUpload());

// Morgan
app.use(logger("dev"));

// Passport
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/main");

// EJS View, Path
app.set("views", path.join(__dirname, "views"));

// Public folder
app.use(express.static("public"));

// Routers
const indexRouter = require("./routers/indexRouter");
app.use(indexRouter);

const userRouter = require("./routers/userRouter");
app.use(userRouter);

const profileRouter = require("./routers/profileRouter");
app.use("/profile", profileRouter);

// handle unrecognized routes
app.get("*", function (req, res) {
  res.status(404).send('<h2 class="error">File Not Found</h2>');
});

// Start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`:: Listening on port ${port}!`));
