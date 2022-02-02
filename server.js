const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
var passport = require("passport");

const app = express();

// DB config
const mongoURI = require("./configdb").mongoURI;

// Connect to mongo
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use(passport.initialize());

const port = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server started running on port ${port}`));

/// middleware function executed everytime app receives request
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

// Bodyparser Middleware
app.use(bodyParser.json());

//Loading routers
const bookRouter = require("./routes/services/bookRouter");
const userRouter = require("./routes/services/userRouter");
const issueRouter = require("./routes/services/issueRouter");

// Use routes
app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);
app.use("/api/issues", issueRouter);
