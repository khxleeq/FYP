var express = require("express");
const bodyParser = require("body-parser");
const issueRouter = express.Router();
const mongoose = require("mongoose");
var Issue = require("../../models/issueModel");
var Books = require("../../models/bookModel");
var Users = require("../../models/userModel");
var passport = require("passport");
var authenticate = require("../../auth");
const cors = require("../CORS");
issueRouter.use(bodyParser.json());

issueRouter
  .route("/")
  .options(cors.corsBypass, (req, res) => {
    res.sendStatus(200);
  })

  // get an issue request
  .get(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    function (req, res, next) {
      Issue.find({})
        .populate("student")
        .populate("book")
        .then(
          (issues) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(issues);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  // post an issue request
  .post(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Books.findById(req.body.book)
        .then(
          (requiredBook) => {
            Users.findById(req.body.student)
              .then(
                (requiredUser) => {
                  if (!requiredBook) {
                    err = new Error("Book doesn't exist");
                    err.status = 400;
                    return next(err);
                  } else if (!requiredUser) {
                    err = new Error("Student RollNo. Invalid");
                    err.status = 400;
                    return next(err);
                  } else if (requiredBook._id && requiredUser._id) {
                    Issue.find({
                      student: req.body.student,
                    })
                      .then((issues) => {
                        notReturned = issues.filter((issue) => !issue.returned);
                        if (notReturned && notReturned.length >= 3) {
                          err = new Error(
                            `The student has already been issued maximum number of books (3). They must return them first`
                          );
                          err.status = 400;
                          return next(err);
                        } else {
                          if (requiredBook.copies > 0) {
                            Issue.create(req.body, function (err, issue) {
                              if (err) return next(err);
                              Issue.findById(issue._id)
                                .populate("student")
                                .populate("book")
                                .exec(function (err, issue) {
                                  if (err) return next(err);
                                  Books.findByIdAndUpdate(
                                    req.body.book,
                                    {
                                      $set: { copies: requiredBook.copies - 1 },
                                    },
                                    { new: true }
                                  )
                                    .then(
                                      (book) => {
                                        res.statusCode = 200;
                                        res.setHeader(
                                          "Content-Type",
                                          "application/json"
                                        );
                                        res.json(issue);
                                      },
                                      (err) => next(err)
                                    )
                                    .catch((err) =>
                                      res.status(400).json({ success: false })
                                    );
                                });
                            });
                          } else {
                            console.log(requiredBook);
                            err = new Error(
                              `This book is unavailable. You can wait for few days, until the book has been returned to library.`
                            );
                            err.status = 400;
                            return next(err);
                          }
                        }
                      })
                      .catch((err) => next(err));
                  }
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  // delete an issue request
  .delete(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Issue.remove({})
        .then(
          (resp) => {
            console.log("Removed All Issue");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

issueRouter
  .route("/student/")
  .options(cors.corsBypass, (req, res) => {
    res.sendStatus(200);
  })

  // get request for a particular student

  .get(cors.corsBypass, authenticate.authUser, (req, res, next) => {
    Issue.find({ student: req.user._id })
      .populate("student")
      .populate("book")
      .then(
        (issue) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(issue);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

issueRouter
  .route("/:issueId")
  .options(cors.corsBypass, (req, res) => {
    res.sendStatus(200);
  })

  // get request for a particular issue

  .get(cors.corsBypass, authenticate.authUser, (req, res, next) => {
    Issue.findById(req.params.issueId)
      .populate("student")
      .populate("book")
      .then(
        (issue) => {
          if (issue && (issue.student._id === req.user._id || req.user.admin)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(issue);
          } else if (!issue) {
            err = new Error(`Issue not found`);
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Unauthorised`);
            err.status = 401;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // update request for a particular issue
  .put(
    cors.corsBypass,
    authenticate.authUser,
    authenticate.authAdmin,
    (req, res, next) => {
      Issue.findById(req.params.issueId)
        .then(
          (issue) => {
            Books.findById(issue.book)
              .then(
                (requiredBook) => {
                  Issue.findByIdAndUpdate(
                    req.params.issueId,
                    {
                      $set: { returned: true },
                    },
                    { new: true }
                  )
                    .populate("student")
                    .populate("book")
                    .then(
                      (issue) => {
                        Books.findByIdAndUpdate(
                          issue.book,
                          {
                            $set: { copies: requiredBook.copies + 1 },
                          },
                          { new: true }
                        )
                          .then(
                            (book) => {
                              res.statusCode = 200;
                              res.setHeader("Content-Type", "application/json");
                              res.json(issue);
                            },
                            (err) => next(err)
                          )
                          .catch((err) =>
                            res.status(400).json({
                              success: false,
                              message: "Book not updated",
                            })
                          );
                      },
                      (err) => next(err)
                    )
                    .catch((err) =>
                      res
                        .status(400)
                        .json({ success: false, message: "Issue not Updated" })
                    );
                },
                (err) => next(err)
              )
              .catch((err) =>
                res
                  .status(400)
                  .json({ success: false, message: "Book not found" })
              );
          },
          (err) => next(err)
        )
        .catch((err) =>
          res.status(400).json({ success: false, message: "Issue not found" })
        );
    }
  );

module.exports = issueRouter;
