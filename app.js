// import
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const logger = require("morgan");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const app = express();

// DB Connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("open", function () {
  console.log("✅ Connected to Mongo");
});
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));

// Middlewares
// Session
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 20 }, // 20 minutes
    store: store,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");
app.set("views", path.join(__dirname, "views"));

// Public folder
app.use(express.static("public"));

// Routers
const indexRouter = require("./routers/indexRouter");
const userRouter = require("./routers/userRouter");
const profileRouter = require("./routers/profileRouter");

app.use(indexRouter);
app.use(userRouter);
app.use("/profile", profileRouter);
app.get("*", function (req, res) {
  res.status(404).send('<h2 class="error">File Not Found</h2>');
});

// Start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`✅ Listening on port ${port}!`));
