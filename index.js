const express = require("express");
const port = process.env.PORT || 3000;
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const useragent = require("express-useragent");
const routes = require("./routes");

const connectDB = require("./config/db");

// ------------- ENV FILE, DATABASE CONNECTION -----------
require("dotenv").config({ path: "./config/config.env" });
connectDB();

// ------- EXPRESS, BODYPARSER, EJS VIEW ENGINE SETUP --------
const app = express();
app.use(useragent.express());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
      extended: true,
  })
);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));
app.use("/images", express.static(__dirname + "static/images"));
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

// ----------- PASSPORT AND EXPRESS SESSION SETUP ------------
app.use(
  session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_DATABASE_URI }),
  })
);
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// --------------------  ROUTES SETUP -----------------------
app.use("/", routes);
app.get("*", function(req, res) {
  res.status(404).send("<h1>404 NOT FOUND!</h1>");
});

//  -------------------- PORT SETUP -----------------------------
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Connection Established!! http://localhost:${port}`);
});
