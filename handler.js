const serverless = require("serverless-http");
const axios = require("axios");
const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Local Imports
const { responseHeader } = require("./middleware/index");
const req = require("express/lib/request");
require("./middleware/passport");
app.use(responseHeader);
app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/authorizeGoogleBusiness",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/business.manage",
      "profile",
      "email",
    ],
  })
);

app.get("/failed", (req, res) => res.send("PLease verify the credentials"));
app.get("/success", (req, res) => res.send("Logged In"));

app.get(
  "/callBack",
  passport.authenticate("google", { failureRedirect: "/dev/failed" }),
  function (req, res) {
    res.redirect("/dev/success");
  }
);

module.exports.handler = serverless(app);
