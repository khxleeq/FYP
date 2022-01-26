var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/userModel");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

var configdb = require("./configdb");

exports.local = passport.use(new LocalStrategy(User.auth()));

// For sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, configdb.secretKey, { expiresIn: 2600 });
};

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretAuthKey = configdb.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
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
