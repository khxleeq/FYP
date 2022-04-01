const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bookRouter = express.Router();
const authenticate = require("../../auth");
const cors = require("../CORS");
const Books = require("../../models/bookModel");
bookRouter.use(bodyParser.json());

bookRouter
  .route("/")
  .options(cors.corsBypass, (req, res) => {
    res.sendStatus(200);
  })

  // GET request for books
  .get(cors.corsBypass, (req, res, next) => {
    Books.find(req.query)
      .sort({ name: "asc" })
      .then(
        (books) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(books);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // POST request for a book
  .post(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Books.create(req.body)
        .then(
          (book) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )


bookRouter
  .route("/:bookId")
  .options(cors.corsBypass, (req, res) => {
    res.sendStatus(200);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  })

  // get request for a bookid
  .get(cors.corsBypass, (req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        (book) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  

  // Update request for a book
  .put(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Books.findByIdAndUpdate(
        req.params.bookId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (book) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book);
          },
          (err) => next(err)
        )
        .catch((err) => res.status(400).json({ success: false }));
    }
  )

  // Delete a book request

  .delete(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Books.findByIdAndRemove(req.params.bookId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ _id: req.params.bookId, success: true });
          },
          (err) => next(err)
        )
        .catch((err) => res.status(400).json({ success: false }));
    }
  );

module.exports = bookRouter;
