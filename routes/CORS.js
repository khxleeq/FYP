const express = require("express");
const cors = require("cors");
const app = express();

const APIURI = ["https://localhost:3000", "https://localhost:5000"];

const corsOptionsProxy = (req, callback) => {
  var corsOptions;
  console.log(req.header("Origin"));

  if (APIURI.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsProxy);
