import React, { Component } from "react";
import { Button, Label, Col, Row } from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import Spinner from "../components/Spinner";

// validators
const required = (val) => val && val.length;
const requiredNumber = (val) => !!val;
const MaxLength = (len) => (val) => !val || val.length <= len;
const MinLength = (len) => (val) => !val || val.length >= len;
const MaxValue = (len) => (val = !val || val <= len);
const MinValue = (len) => (val = !val || val >= len);
const isNumber = (val) => !isNaN(Number(val));

class AddNewBook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    // variables
    let uniqueISBN = (val) =>
      !this.props.books.some((book) => book.isbn === val);
    let uniqueName = (val = !this.props.books.some(
      (book) => book.name === val
    ));

    // Spinner //
    if (this.props.booksLoading) {
      return (
        <div className="container">
          <div className="row">
            <Spinner />
          </div>
        </div>
      );
      // Error Msg //
    } else if (this.props.booksErrMsg) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-15">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.booksErrMsg}</h3>
            </div>
          </div>
        </div>
      );
    } else
      return (
        // return an add a book page
        <div className="container">
          // Title of book//
          <div className="row justify-content-center heading">
            <div className="col-15">
              <h3 align="center"> Add a book</h3>
            </div>
          </div>
          <div className="row row-content justify-content-center">
            <LocalForm
              // on submit values
              onSubmit={(values) => {
                this.props.postBook(
                  values.name,
                  values.author,
                  values.desc,
                  values.isbn,
                  values.cat,
                  values.copies,
                  values.shelf,
                  values.floor
                );
              }}
            >
              <Row className="form-group">
                // Book name//
                <Label htmlFor="name" md={2}>
                  Name{" "}
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".name"
                    id="name"
                    name="name"
                    placeholder="Book name.."
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      uniqueName,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: " Book name must have more than 2 letters.",
                      uniqueName: " This book already exists",
                    }}
                  />
                </Col>
                // Author name//
                <Label htmlFor="author" md={2}>
                  Authors{" "}
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Author name.."
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: " Author name must have more than 2 letters",
                    }}
                  />
                </Col>
              </Row>

              <Row className="form-group">
                // ISBN number//
                <Label htmlFor="isbn" md={2}>
                  ISBN No.
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".isbn"
                    id="isbn"
                    name="isbn"
                    placeholder="ISBN No..."
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(10),
                      maxLength: maxLength(13),
                      isNumber,
                      uniqueISBN,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".isbn"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: " Must be greater than 9 numbers",
                      maxLength: " Must be 13 numbers or less",
                      isNumber: " Must be a number",
                      uniqueISBN: " Book with this ISBN number already exists",
                    }}
                  />
                </Col>
                // Copies available//
                <Label htmlFor="copies" md={3}>
                  {" "}
                  Copies Available
                </Label>
                <Col md={3}>
                  <Control.text
                    model=".copies"
                    id="copies"
                    name="copies"
                    placeholder="Copies available.."
                    className="form-control"
                    validators={{
                      requiredNumber,
                      MinValue: minValue(1),
                      MaxValue: maxValue(1000),
                      isNumber,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".copies"
                    show="touched"
                    messages={{
                      requiredNumber: "Required",
                      minValue: " Must be greater than 0",
                      maxValue: " Must be 1000 or less",
                      isNumber: " Must be a number",
                    }}
                  />
                </Col>
              </Row>

              <Row className="form-group">
                <Col>
                  // Category //
                  <Label htmlFor="cat">Category</Label>
                  <Control.select
                    defaultValue="Technology"
                    model=".cat"
                    id="cat"
                    className="form-control"
                  >
                    <option>Technology</option> <option>Romance</option>
                    <option>Computer Science</option>{" "}
                    <option>Management</option>
                    <option>Electronics</option> <option>Physics</option>
                    <option>Chemistry</option> <option>Mathematics</option>
                    <option>Fiction</option> <option>Philosophy</option>
                    <option>Language</option> <option>Arts</option>
                    <option>Other</option>
                  </Control.select>
                </Col>
                <Col>
                  // Floor //
                  <Label htmlFor="floor">Floor </Label>
                  <Control.select
                    defaultValue={0}
                    model=".floor"
                    id="floor"
                    className="form-control"
                  >
                    <option>0</option> <option>1</option>
                    <option>2</option> <option>3</option>
                    <option>4</option>
                  </Control.select>
                </Col>
              </Row>

              <Row className="form-group text-center justify-content-center">
                // Shelf//
                <Label htmlFor="shelf" md={3}>
                  {" "}
                  Shelf
                </Label>
                <Col md={6}>
                  <Control.text
                    model=".shelf"
                    id="shelf"
                    name="shelf"
                    placeholder="Shelf no. for locating book"
                    className="form-control"
                    validators={{
                      requiredNumber,
                      minValue: minVal(1),
                      maxValue: maxVal(100),
                      isNumber,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".shelf"
                    show="touched"
                    messages={{
                      requiredNumber: "Required",
                      minValue: " Must be greater than 0",
                      maxValue: " Must be 100 or less",
                      isNumber: " Must be a number",
                    }}
                  />
                </Col>
              </Row>

              <Row className="form-group">
                // Book Descrption //
                <Label htmlFor="desc" md={2}>
                  Description
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model=".desc"
                    id="desc"
                    name="desc"
                    rows="12"
                    placeholder="Book description..."
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="align-self-center">
                <Col className="text-center">
                  <Button type="submit" className="bg-primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </LocalForm>
          </div>
          <br />
        </div>
      );
  }
}
