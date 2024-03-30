const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const useragent = require("express-useragent");
const routes = require("./routes");
const path = require("path");
const cookieParser = require("cookie-parser")
const cors = require('cors');
const connectDB = require("./config/db");


// ------------- ENV FILE, DATABASE CONNECTION -----------
require("dotenv").config({ path: "./config/config.env" });
connectDB();

// ------- EXPRESS, BODYPARSER, COOKIEPARSER SETUP --------
const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Update with the origin of your React app
  credentials: true,
};

app.use('*', cors(corsOptions));
app.use(cookieParser());
app.use(useragent.express());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  if (!req.user) {
    res.header(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
  }
  next();
});

// ------- EJS VIEW ENGINE SETUP --------

// app.set("views", "./views");
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/static"));
// app.use("/images", express.static(__dirname + "static/images"));

// ------- REACT BUILD SETUP --------

// const buildPath = path.join(__dirname, "notes/build");
// app.use(express.static(buildPath)) // use after static build

// ----------- PASSPORT AND EXPRESS SESSION SETUP ------------
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DATABASE_URI }),
    cookie: { maxAge: 18000000 }
  })
);
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// --------------------  ROUTES SETUP -----------------------
app.use("/", routes);

//  -------------------- PORT SETUP -----------------------------
const port = process.env.PORT || 8000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Connection Established!! http://localhost:${port}`);
});
