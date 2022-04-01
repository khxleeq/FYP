var passport = require("passport");
var localStrat = require("passport-local").Strategy;
var User = require("./models/userModel");
var jwtStrat = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwebtoken = require("jsonwebtoken"); 
var config = require("./configdb");

exports.local = passport.use(new localStrat(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwebtoken.sign(user, config.secretKey, { expiresIn: 1800 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new jwtStrat(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.authUser = passport.authenticate("jwt", { session: false });

exports.authAdmin = function (req, res, next) {
  if (req.user.admin) {
    next();
  } else {
    var err = new Error("You are not authorized!");
    err.status = 403;
    return next(err);
  }
};
