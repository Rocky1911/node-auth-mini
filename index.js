require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const strategy = require("./strategy");
const app = express();

const port = 3001;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
// first we initial passport then we invoke it with session
app.use(passport.session());
passport.use(strategy);
// takes in auth0strategy, and uses those credentials to login.
// Use to allow user to authenicate with auth0
// so we can use/access the users info

passport.serializeUser((user, done) => {
  done(null, user);
});
// serializeUser is called once
// this is where we describe what the user object will look like. Pulls off the data. Make the request
// to get the info (name, nickname, height, weight, etc)

passport.deserializeUser((user, done) => {
  done(null, user);
});
// is called on everytime on sessoin
// after serializeUser. ???? req session passport user and req user
// takes the info from serializeUser and put on session

app.get(
  "/api/login",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    failureRedirect: "/login"
  })
);
// starts login process- if its good go to user/me if fails go back to login
// will be forwarded here from auth0

app.get("/me", (req, res, next) => {
  // check to see if user is on session here
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(401).send("No User");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
