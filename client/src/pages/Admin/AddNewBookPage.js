import React, { Component } from "react";
import { Button, Label, Col, Row } from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";
import Spinner from "../../components/Spinner";

// validators
const required = (val) => val && val.length;
const requiredNumber = (val) => !!val;
const maxLen = (len) => (val) => !val || val.length <= len;
const minLen = (len) => (val) => val && val.length >= len;
const maxVal = (len) => (val) => !val || val <= len;
const minVal = (len) => (val) => val && val >= len;
const isNumber = (val) => !isNaN(Number(val));

class AddNewBookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {

    let uniqueISBN = (val) =>
      !this.props.books.some((book) => book.isbn === val);
    let uniqueName = (val) =>
      !this.props.books.some((book) => book.name === val);


    if (this.props.booksLoading) {
      return (
        <div className="container">
          <div className="row">
            <Spinner />
          </div>
        </div>
      );

    } else if (this.props.booksErrMsg) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12">
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

        <div className="container">
          <div className="addBookHeading">
            <h3 align="center"> Add a book</h3>
          </div>
          <div className="addForm">
            <LocalForm
              onSubmit={(values) => {
                this.props.postBook(
                  values.name,
                  values.author,
                  values.desc,
                  values.isbn,
                  values.cat,
                  values.floor,
                  values.shelf,
                  values.copies
                );
              }}
            >
              <Row className="form-group">
                <Label htmlFor="name" className="formLabelName" md={2}>
                  Name
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
                      minLen: minLen(3),
                      uniqueName,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      minLen: "Book name must have more than 2 characters",
                      uniqueName: "Book name already exists",
                    }}
                  />
                </Col>
                <Label htmlFor="author" className="formLabelAuthors" md={2}>
                  Authors
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".author"
                    id="author"
                    name="author"
                    placeholder="Author(s) name.."
                    className="form-control"
                    validators={{
                      required,
                      minLen: minLen(3),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    messages={{
                      minLen: "Author(s) name must have more than 2 characters",
                    }}
                  />
                </Col>
              </Row>

              <Row className="form-group">
                <Label htmlFor="isbn" className="formLabelISBN" md={2}>
                  ISBN No.
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".isbn"
                    id="isbn"
                    name="isbn"
                    placeholder="ISBN No.."
                    className="form-control"
                    validators={{
                      required,
                      minLen: minLen(10),
                      maxLen: maxLen(13),
                      isNumber,
                      uniqueISBN,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".isbn"
                    show="touched"
                    messages={{
                      minLen: "ISBN No must be greater than 9 numbers",
                      maxLen: " ISBN No must be smaller than 14 numbers",
                      isNumber: "ISBN must be a number!",
                      uniqueISBN: "This ISBN No already exists",
                    }}
                  />
                </Col>

                <Label htmlFor="cat" className="formLabelCategory" md={2}>
                  Category
                </Label>
                <Col md={4}>
                  <Control.select
                    defaultValue="Technology"
                    model=".cat"
                    id="cat"
                    className="form-control"
                  >
                    <option>Technology</option>
                    <option>Computer Science</option><option>Non-Fiction</option>
                    <option>Management</option> <option>Romance</option>
                    <option>Electronics</option> <option>Physics</option>
                    <option>Chemistry</option> <option>Mathematics</option>
                    <option>Fiction</option> <option>Philosophy</option>
                    <option>Language</option><option>Other</option>
                  </Control.select>
                </Col>
              </Row>
              <Row className="form-group">
                <Label md={2} htmlFor="shelf" className="formLabelShelf" md={2}>
                  Shelf
                </Label>
                <Col md={4}>
                  <Control.text
                    model=".shelf"
                    id="shelf"
                    name="shelf"
                    placeholder="Shelf No. of the book.."
                    className="form-control"
                    validators={{
                      requiredNumber,
                      minVal: minVal(1),
                      maxVal: maxVal(100),
                      isNumber,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".shelf"
                    show="touched"
                    messages={{
                      minVal: "Shelf no be greater than 0",
                      maxVal: "Shelf no must be 100 or less",
                      isNumber: "Shelf must be a number!",
                    }}
                  />
                </Col>
                <Label htmlFor="floor" className="formLabelfloor" md={2}>
                  Floor{" "}
                </Label>
                <Col md={4}>
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
              <Row className="form-group">
                <Label htmlFor="copies" md={2} className="formLabelCopies">
                  Copies Available
                </Label>
                <Col md={1}>
                  <Control.text
                    model=".copies"
                    id="copies"
                    name="copies"
                    placeholder="No.."
                    className="form-control"
                    validators={{
                      requiredNumber,
                      minVal: minVal(1),
                      maxVal: maxVal(100),
                      isNumber,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".copies"
                    show="touched"
                    messages={{
                      minVal: "Copies available must be greater than 0",
                      maxVal: " Copies available must be 100 or less",
                      isNumber: " Copies available must be a number!",
                    }}
                  />
                </Col>
              </Row>

              <Row className="form-group">
                <Label htmlFor="desc" className="formLabelDesc" md={2}>
                  Description
                </Label>
                <Col md={10}>
                  <Control.textarea
                    model=".desc"
                    id="descn"
                    name="desc"
                    rows="6"
                    placeholder="Book Description.."
                    className="form-control"
                  />
                </Col>
              </Row>
              <Row className="align-self-center">
                <Col className="text-center">
                  <Button  className="addBookBtn" type="submit" value="submit">
                    Add
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

export default AddNewBookPage;
