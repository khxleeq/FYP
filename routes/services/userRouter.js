var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var User = require("../../models/userModel");
var passport = require("passport");
var authenticate = require("../../auth");
const cors = require("../CORS");

router.use(bodyParser.json());

/* GET users listing. */
router.options("*", cors.corsBypass, (req, res) => {
  req.headers;
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// GET users request
router.get(
  "/",
  cors.corsBypass,
  authenticate.authUser,
  authenticate.authAdmin,
  function (req, res, next) {
    User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);


// register request

router.post("/signup", cors.corsBypass, (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      rollNumber: req.body.rollNumber,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Sign-up Successful!" });
          });
        });
      }
    }
  );
});

// login request

router.post(
  "/signin",
  cors.corsBypass,
  passport.authenticate("local"),
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Sign-in failed!", err: info });
      }
      req.logIn(user, (err) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: false,
            status: "Sign-in failed!",
            err: "Could not sign-in user!",
          });
        }

        var token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: "Sign-in successful!",
          token: token,
          userinfo: req.user,
        });
      });
    })(req, res, next); 
  }
);

// logout request

router.get("/logout", cors.cors, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not signed in!");
    err.status = 403;
    next(err);
  }
});

module.exports = router;
