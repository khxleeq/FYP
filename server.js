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
