import React, { Component } from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import LandingPage from "../pages/LandingPage";
import BooksListPage from "../pages/BooksListPage";
import SearchPage from "../pages/SearchPage";
import BookInfoPage from "../pages/BookInfoPage";
import ProfilePage from "../pages/ProfilePage";
import AddNewBookPage from "../pages/Admin/AddNewBookPage";
import HistoryPage from "../pages/Student/HistoryPage";
import IssuePage from "../pages/Admin/IssuePage";
import ReturnPage from "../pages/Admin/ReturnPage";
import UserInfoPage from "../pages/Admin/UserInfoPage";
import StatsPage from "../pages/Admin/StatsPage";
import LogPage from "../pages/Admin/LogPage";
import UsersListPage from "../pages/Admin/UsersListPage";

import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Label,
  Col,
  Row,
} from "reactstrap";

import {
  postBook,
  editBook,
  removeBook,
  fetchBooks,
  fetchUsers,
  signinUser,
  signupUser,
  signoutUser,
  postIssue,
  returnIssue,
  fetchIssues,
} from "../redux/action-creators";
import { Control, LocalForm, Errors } from "react-redux-form";

/// validators ///

const required = (val) => val && val.length;
const requiredNumber = (val) => !!val;
const maxLen = (len) => (val) => !(val) || (val.length <= len);
const minLen = (len) => (val) => !(val) || (val.length >= len);
const maxVal = (len) => (val) => !(val) || (val <= len);
const minVal = (len) => (len) => (val) => !(val) || (val<= len);
const isNumber = (val) => !isNaN(Number(val));


// map state to props - to get data from the redux store for required

const mapStateToProps = (state) => {
  return {
    books: state.books,
    auth: state.auth,
    issues: state.issues,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postBook: (name, author, desc, isbn, cat, floor, shelf, copies) =>
    dispatch(postBook(name, author, desc, isbn, cat, floor, shelf, copies)),
  editBook: (_id, name, author, desc, isbn, cat, floor, shelf, copies) =>
    dispatch(
      editBook(_id, name, author, desc, isbn, cat, floor, shelf, copies)
    ),
  removeBook: (_id) => dispatch(removeBook(_id)),
  fetchBooks: () => {
    dispatch(fetchBooks());
  },
  fetchUsers: () => {
    dispatch(fetchUsers());
  },
  signinUser: (creds) => dispatch(signinUser(creds)),
  signoutUser: () => dispatch(signoutUser()),
  signupUser: (creds) => dispatch(signupUser(creds)),
  postIssue: (bookId, studentId) => dispatch(postIssue(bookId, studentId)),
  returnIssue: (issueId) => dispatch(returnIssue(issueId)),
  fetchIssues: (student) => {
    dispatch(fetchIssues(student));
  },
});

class Main extends Component {
  componentDidMount() {
    this.props.fetchBooks();
    if (this.props.auth.isAuthenticated) {
      this.props.fetchIssues(!this.props.auth.userinfo.admin);
    }
    if (this.props.auth.isAuthenticated && this.props.auth.userinfo.admin) {
      this.props.fetchUsers();
      console.log(fetchUsers());
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      isDeleteBookModalOpen: false,
      isEditBookModalOpen: false,
      selectedBook: null,
    };
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
  }

  handleSubmitEdit(values) {
    this.toggleEditModal();
    this.props.editBook(
      this.state.selectedBook._id,
      values.name,
      values.author,
      values.desc,
      values.isbn,
      values.cat,
      values.floor,
      values.shelf,
      values.copies
    );
  }

  toggleChange(_id) {
    this.setState({
      selectedBook: this.props.books.books.filter(
        (book) => book._id === _id
      )[0],
    });
  }

  toggleDeleteModal() {
    this.setState({ isDeleteBookModalOpen: !this.state.isDeleteBookModalOpen });
  }

  toggleEditModal() {
    this.setState({ isEditBookModalOpen: !this.state.isEditBookModalOpen });
  }

  render() {
    const BookWithId = ({ match }) => {
      let selectedBook = this.props.books.books.filter(
        (book) => book._id === match.params.bookId
      )[0];
      let notFoundErr = null;
      if (selectedBook === undefined) {
        notFoundErr = "\n\n Error 404 :  Book not found";
      }
      return (
        <BookInfoPage
          book={selectedBook}
          isLoading={this.props.books.isLoading}
          errMsg={this.props.books.errMsg || notFoundErr}
          toggleEditModal={this.toggleEditModal}
          toggleChange={this.toggleChange}
          isAdmin={
            this.props.auth.userinfo == null
              ? false
              : this.props.auth.userinfo.admin
          }
        />
      );
    };

    const UserWithId = ({ match }) => {
      let selectedUser = this.props.users.users.filter(
        (user) => user._id === match.params.userId
      )[0];
      let notFoundErr = null;
      if (selectedUser === undefined) {
        notFoundErr = "\n\n Error 404 :  User not found";
      }
      return (
        <UserInfoPage
          user={selectedUser}
          isLoading={this.props.users.isLoading}
          errMsg={this.props.users.errMsg || notFoundErr}
        />
      );
    };

    //  Authorization access routes

    const PrivateRouteCommon = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.props.auth.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );

    const PrivateRouteAdmin = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.props.auth.isAuthenticated && this.props.auth.userinfo.admin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.props.auth.isAuthenticated && !this.props.auth.userinfo.admin ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );

  
    let uniqueIsbn = (defaultIsbn) => (val) =>
      !this.props.books.books.some((book) => book.isbn === val) ||
      val === defaultIsbn;
    let uniqueName = (defaultName) => (val) =>
      !this.props.books.books.some((book) => book.name === val) ||
      val === defaultName;

    return (
      <div className="App">
        <Header
          auth={this.props.auth}
          signinUser={this.props.signinUser}
          signoutUser={this.props.signoutUser}
          signupUser={this.props.signupUser}
        />
        

        <Switch location={this.props.location}>
          <Route exact path="/home" component={() => <LandingPage />} />

          <Route
            exact
            path="/search"
            component={() => (
              <SearchPage
                books={this.props.books.books}
                booksLoading={this.props.books.isLoading}
                booksErrMsg={this.props.books.errMsg}
                isSignedIn={this.props.auth.isAuthenticated}
                isAdmin={
                  this.props.auth.userinfo == null
                    ? false
                    : this.props.auth.userinfo.admin
                }
                toggleEditModal={this.toggleEditModal}
                toggleDeleteModal={this.toggleDeleteModal}
                toggleChange={this.toggleChange}
              />
            )}
          />

          <Route
            exact
            path="/books"
            component={() => (
              <BooksListPage
                books={this.props.books.books}
                booksLoading={this.props.books.isLoading}
                booksErrMsg={this.props.books.errMsg}
                isSignedIn={this.props.auth.isAuthenticated}
                isAdmin={
                  this.props.auth.userinfo == null
                    ? false
                    : this.props.auth.userinfo.admin
                }
                auth={this.props.auth}
                toggleEditModal={this.toggleEditModal}
                toggleDeleteModal={this.toggleDeleteModal}
                toggleChange={this.toggleChange}
              />
            )}
          />

          <Route path="/books/:bookId" component={BookWithId} />

          <PrivateRouteCommon
            exact
            path="/profile"
            component={() => (
              <ProfilePage
                auth={this.props.auth}
                editUser={this.props.editUser}
                editPassword={this.props.editPassword}
              />
            )}
          />

          <PrivateRouteAdmin
            exact
            path="/add_book"
            component={() => (
              <AddNewBookPage
                isAdmin={
                  this.props.auth.userinfo == null
                    ? false
                    : this.props.auth.userinfo.admin
                }
                postBook={this.props.postBook}
                books={this.props.books.books}
                booksLoading={this.props.books.isLoading}
                booksErrMsg={this.props.books.errMsg}
              />
            )}
          />

          <PrivateRoute
            exact
            path="/profile"
            component={() => (
              <ProfilePage auth={this.props.auth} editUser={this.props.editUser} />
            )}
          />

          <PrivateRoute
            exact
            path="/history"
            component={() => (
              <HistoryPage issues={this.props.issues} auth={this.props.auth} />
            )}
          />

          <PrivateRouteAdmin
            exact
            path="/log"
            component={() => <LogPage issues={this.props.issues} />}
          />

          <PrivateRouteAdmin
            exact
            path="/liststudents"
            component={() => (
              <UsersListPage
                users={this.props.users.users.filter((user) => !user.admin)}
                usersLoading={this.props.users.isLoading}
                usersErrMsg={this.props.users.errMsg}
              />
            )}
          />

          <PrivateRouteAdmin
            exact
            path="/listadmins"
            component={() => (
              <UsersListPage
                users={this.props.users.users.filter((user) => user.admin)}
                usersLoading={this.props.users.isLoading}
                usersErrMsg={this.props.users.errMsg}
              />
            )}
          />

          <PrivateRouteAdmin
            exact
            path="/issue"
            component={() => (
              <IssuePage
                auth={this.props.auth}
                books={this.props.books.books}
                booksLoading={this.props.books.isLoading}
                booksErrMsg={this.props.books.errMsg}
                users={this.props.users.users}
                usersLoading={this.props.users.isLoading}
                usersErrMsg={this.props.users.errMsg}
                postIssue={this.props.postIssue}
              />
            )}
          />

          <PrivateRouteAdmin
            exact
            path="/return"
            component={() => (
              <ReturnPage
                issues={this.props.issues}
                auth={this.props.auth}
                returnIssue={this.props.returnIssue}
              />
            )}
          />

          <PrivateRouteAdmin path="/users/:userId" component={UserWithId} />

          <PrivateRouteAdmin
            path="/stats"
            component={() => (
              <StatsPage
                issues={this.props.issues}
                books={this.props.books.books}
                booksLoading={this.props.books.isLoading}
                booksErrMsg={this.props.books.errMsg}
                users={this.props.users.users}
                usersLoading={this.props.users.isLoading}
                usersErrMsg={this.props.users.errMsg}
              />
            )}
          />

          <Redirect to="/home" />
        </Switch>

        <Footer />


        <Modal className="deleteBookModal"
          isOpen={this.state.isDeleteBookModalOpen}
          toggle={this.toggleDeleteModal}
        >
          <ModalHeader className="deleteBookModalHeader" toggle={this.toggleDeleteModal}>
            Delete this book
          </ModalHeader>
          <ModalBody className="deleteBookModalBody">
            BOOK DETAILS: : <br />
            <br />
            Name : {this.state.selectedBook
              ? this.state.selectedBook.name
              : ""}{" "}
            <br />
            Authors :{" "}
            {this.state.selectedBook ? this.state.selectedBook.author : ""}{" "}
            <br />
            ISBN Number :{" "}
            {this.state.selectedBook ? this.state.selectedBook.isbn : ""} <br />
            Available Copies :{" "}
            {this.state.selectedBook ? this.state.selectedBook.copies : ""}{" "}
            <br /> <br />
            Are you sure you want to delete this book? <br />
            <br />
            <Button className="deleteBookBtns"
              color="danger"
              onClick={() => {
                this.props.removeBook(this.state.selectedBook._id);
                this.toggleDeleteModal();
              }}
            >
              Yes
            </Button>{" "}
            <Button className="deleteBookBtns"
              color="warning"
              onClick={() => {
                this.toggleDeleteModal();
              }}
            >
              No
            </Button>
          </ModalBody>
        </Modal>
        {this.state.selectedBook ? (
          <Modal className="editBookModal"
            isOpen={this.state.isEditBookModalOpen}
            toggle={this.toggleEditModal}
          >
            <ModalHeader className="editBookModalHeader" toggle={this.toggleEditModal}>Edit this book</ModalHeader>
            <ModalBody className="editBookModalBody">
              <LocalForm onSubmit={(values) => this.handleSubmitEdit(values)}>
                <Row className="form-group">
                  <Label className="editBookModalLabel" htmlFor="name" md={2}>
                    Name:
                  </Label>
                  <Col md={8}>
                    <Control.text
                      model=".name"
                      id="name"
                      name="name"
                      defaultValue={this.state.selectedBook.name}
                      className="form-control"
                      validators={{
                        required,
                        minLen: minLen(3),
                        uniqueName: uniqueName(this.state.selectedBook.name),
                      }}
                    />
                    <Errors
                      className="text-danger"
                      model=".name"
                      show="touched"
                      messages={{
                        minLen: "Must be greater than 2 characters",
                        uniqueName:
                          " Book name already exists",
                      }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label className="editBookModalLabel" htmlFor="author" md={2}>
                    Author(s):
                  </Label>
                  <Col md={8}>
                    <Control.text
                      model=".author"
                      id="author"
                      name="author"
                      defaultValue={this.state.selectedBook.author}
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
                  <Label className="editBookModalLabel" htmlFor="isbn" md={2}>
                    ISBN:
                  </Label>
                  <Col md={6}>
                    <Control.text
                      model=".isbn"
                      id="isbn"
                      name="isbn"
                      defaultValue={this.state.selectedBook.isbn}
                      className="form-control"
                      validators={{
                        required,
                        minLen: minLen(10),
                        maxLen: maxLen(13),
                        isNumber,
                        uniqueIsbn: uniqueIsbn(this.state.selectedBook.isbn),
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
                </Row>

                <Row className="form-group">
                <Label className="editBookModalLabel" htmlFor="cat" md={2} >Category:</Label>
                  <Col md={8} >
                    <Control.select
                    defaultValue={this.state.selectedBook.cat}
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
                  <Label className="editBookModalLabel" htmlFor="shelf" md={2}>
                    Shelf:
                  </Label>
                  <Col md={4}>
                    <Control.text
                      model=".shelf"
                      id="shelf"
                      name="shelf"
                      defaultValue={this.state.selectedBook.shelf}
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
                      messages={{
                        minVal: "Shelf no be greater than 0",
                        maxVal: "Shelf no must be 100 or less",
                        isNumber: "Shelf must be a number!",
                      }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                <Label className="editBookModalLabel" htmlFor="floor" md={2}>Floor:</Label>
                  <Col md={4}>
                    <Control.select
                      model=".floor"
                      id="floor"
                      className="form-control"
                      defaultValue={this.state.selectedBook.floor}
                    >
                      <option>0</option> <option>1</option>
                      <option>2</option> <option>3</option>
                      <option>4</option> 
                    </Control.select>
                  </Col>
                </Row>

                <Row className="form-group">
                  <Label className="editBookModalLabel" htmlFor="copies" md={2}>
                    Copies:
                  </Label>
                  <Col md={2}>
                    <Control.text
                      model=".copies"
                      id="copies"
                      name="copies"
                      defaultValue={this.state.selectedBook.copies}
                      className="form-control"
                      validators={{
                        requiredNumber,
                        minVal: minVal(1),
                        maxVal: maxVal(1000),
                        isNumber,
                      }}
                    />
                    <Errors
                      className="text-danger"
                      model=".copies"
                      messages={{
                      minVal: "Copies available must be greater than 0",
                      maxVal: " Copies available must be 100 or less",
                      isNumber: " Copies available must be a number!",
                      }}
                    />
                  </Col>
                </Row>

                <Row className="form-group">
                  <Label className="editBookModalLabel" htmlFor="desc" md={2}>
                    Desc:
                  </Label>
                  <Col md={10}>
                    <Control.textarea
                      model=".desc"
                      id="desc"
                      name="desc"
                      rows="6"
                      defaultValue={this.state.selectedBook.desc}
                      className="form-control"
                    />
                  </Col>
                </Row>
                <Row className="align-self-center">
                  <Col className="text-center">
                    <Button type="submit" className="editBookBtn">
                      Confirm
                    </Button>
                  </Col>
                </Row>
              </LocalForm>
            </ModalBody>
          </Modal>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
