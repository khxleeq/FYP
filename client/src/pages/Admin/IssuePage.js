import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col, Row } from "reactstrap";

class IssuePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isbn: "",
      rollNumber: "",
    };
  }


  render() {
    {
      const booksMapping = this.props.books.map((book, index) => (
        <option key={book.isbn}>{book.isbn}</option>
      ));
      const currentBook = this.props.books[0];

      // To just get list of the students 
      let usersMapping = this.props.users.filter((user) => !user.admin);
      const currentUser = usersMapping[0];

      usersMapping = usersMapping.map((user, index) => (
        <option key={user.rollNumber}>{user.rollNumber}</option>
      ));


      if (this.state.isbn === "") {
        this.setState({
          isbn: currentBook.isbn,
          rollNumber: currentUser.rollNumber,
        });
      }
      return (
        <div className="container">
          <div className="row issueComponent">
            <div className="col-12 issueHeader">
              <h3 align="center"> Issue books</h3>
            </div>
          </div>
          <div className="row issueForm">
            <Form
              onSubmit={(e) => {
                let bookid = this.props.books.filter(
                  (book) => book.isbn === this.state.isbn
                )[0]._id;
                let studentid = this.props.users.filter(
                  (user) => user.rollNumber === this.state.rollNumber
                )[0]._id;
                this.props.postIssue(bookid, studentid);
                e.preventDefault();
              }}
            >
              <FormGroup row>
                <Label htmlFor="isbn"> ISBN:</Label>
                <Input
                  type="select"
                  defaultValue={currentBook.name}
                  name="isbn"
                  id="isbn"
                  onInput={(e) => {
                    this.setState({ isbn: e.target.value });
                  }}
                >
                  {booksMapping}
                </Input>
              </FormGroup>


              <FormGroup row>
                <Label htmlFor="rollNumber"> Roll No: </Label>
                <Input
                  type="select"
                  id="rollNumber"
                  onInput={(e) => {
                    this.setState({ rollNumber: e.target.value });
                  }}
                >
                  {usersMapping}
                </Input>
              </FormGroup>


              <FormGroup row>
                <Label htmlFor="name"> Book Name: </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name of Book"
                  defaultValue={currentBook.name}
                  value={
                    !this.state.isbn
                      ? ""
                      : this.props.books.filter(
                          (book) => book.isbn === this.state.isbn
                        )[0].name
                  }
                  disabled
                />
              </FormGroup>


              <FormGroup row>
                <Label htmlFor="author"> Author(s): </Label>
                <Input
                  type="text"
                  id="author"
                  name="author"
                  placeholder="Name of authors"
                  defaultValue={currentBook.author}
                  value={
                    !this.state.isbn
                      ? ""
                      : this.props.books.filter(
                          (book) => book.isbn === this.state.isbn
                        )[0].author
                  }
                  disabled
                />
              </FormGroup>

              
              <FormGroup row>
                <Label htmlFor="name_student"> Student Name: </Label>
                <Input
                  type="text"
                  id="name_student"
                  name="name_student"
                  placeholder="Name of student"
                  defaultValue={
                    currentUser.firstname + " " + currentUser.lastname
                  }
                  value={
                    !this.state.rollNumber
                      ? ""
                      : this.props.users.filter(
                          (user) => user.rollNumber === this.state.rollNumber
                        )[0].firstname +
                        " " +
                        this.props.users.filter(
                          (user) => user.rollNumber === this.state.rollNumber
                        )[0].lastname
                  }
                  disabled
                />
              </FormGroup>
              
              <FormGroup row>
                <Label htmlFor="username"> Username of Student: </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username of student"
                  defaultValue={currentUser.username}
                  value={
                    !this.state.rollNumber
                      ? ""
                      : this.props.users.filter(
                          (user) => user.rollNumber === this.state.rollNumber
                        )[0].username
                  }
                  disabled
                />
              </FormGroup>


                <Col className="text-center">
                  <Button type="submit" className="issueBookBtn">
                    Issue
                  </Button>
                </Col>
            </Form>
          </div>
          <br />
        </div>
      );
    }
  }
}

export default IssuePage;
