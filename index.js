const express = require("express");
const AuthRoute = require("./routes/auth-routes");
const profileRoute = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const facebookSetup = require("./config/facebook-setup");
const linkedinSetup = require("./config/linkedin-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const session = require("express-session");

const app = express();
//set up views
app.set("view engine", "ejs");
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.secrets],
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
//routes
app.use("/auth", AuthRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});
//connect to mongodb
mongoose.connect(
  keys.DATA_BASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    app.listen(2000, () => {
      console.log("app now lsitening on port 2000");
    });
  }
);
