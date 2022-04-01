import React, { Component } from "react";
import {
  Navbar,
  Form,
  FormGroup,
  Label,
  Input,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavbarBrand,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
} from "reactstrap";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";

const required = (val) => val && val.length;
const maxLen = (len) => (val) => !val || val.length <= len;
const minLen = (len) => (val) => val && val.length >= len;
const validEmail = (val) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

function EnableSignUp(props) {
  if (props.isSignedIn === false)
    return (
      <React.Fragment>
        &nbsp; &nbsp;
        <Button className="unAuthBtns" outline onClick={props.toggleSignup}>
          <span className="fa fa-user-plus fa-lg"></span> Sign-up
        </Button>
      </React.Fragment>
    );
  else return <div></div>;
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavBarOpen: false,
      isModalOpen: false,
      isSignUpOpen: false,
      dropdownOpen: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleNavBar = this.toggleNavBar.bind(this);
    this.toggleSignin = this.toggleSignin.bind(this);
    this.toggleSignout = this.toggleSignout.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  // States
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  toggleNavBar() {
    if (window.innerWidth < 1200) {
      this.setState({
        isNavBarOpen: !this.state.isNavBarOpen,
      });
    }
  }

  toggleSignin(event) {
    this.toggleModal();
    this.props.signinUser({
      username: this.username.value,
      password: this.password.value,
    });
    event.preventDefault();
  }

  toggleSignout() {
    this.props.signoutUser();
  }

  toggleSignup(event) {
    this.setState({
      isSignUpOpen: !this.state.isSignUpOpen,
    });
  }

  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    return (
      <React.Fragment>
        <Navbar className="navbar" dark expand="xl" fixed="top">
          <div className="container navbarcontainer">
            <NavbarToggler  onClick={this.toggleNavBar}></NavbarToggler>
            <NavbarBrand className="title" href="/home">
              E-Library
            </NavbarBrand>
            <Collapse isOpen={this.state.isNavBarOpen} navbar>
              <Nav navbar>
                <NavItem
                  className="ml-2 mt-1 homeButton"
                  onClick={this.toggleNavBar}
                >
                  <NavLink className="nav-link" to="/home">
                    <span className="fa fa-home fa-lg " /> Home
                  </NavLink>
                </NavItem>
                {this.props.auth.userinfo && this.props.auth.userinfo.admin ? (
                  <NavItem className="ml-2 mt-1 homeButton">
                    <Dropdown
                      className="dropdown-btn"
                      isOpen={this.state.dropdownOpen}
                      toggle={this.toggleDropdown}
                    >
                      <DropdownToggle color="Primary ml-2 mt-1.3 homeButton">
                        <span className="fa fa-book fa-lg" /> Books &nbsp;
                        <i
                          className="fa fa-caret-down fa-sm"
                          aria-hidden="true"
                        ></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          onClick={this.toggleNavBar}
                          tag={Link}
                          to="/books"
                        >
                          Manage books
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem
                          onClick={this.toggleNavBar}
                          tag={Link}
                          to="/add_book"
                        >
                          Add book
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>
                ) : (
                  <NavItem
                    className="ml-2 mt-1 homeButton"
                    onClick={this.toggleNavBar}
                  >
                    <NavLink className="nav-link" to="/books">
                      <span className="fa fa-book fa-lg" /> Books
                    </NavLink>
                  </NavItem>
                )}

                <NavItem
                  className="ml-2 mt-1 homeButton"
                  onClick={this.toggleNavBar}
                >
                  <NavLink className="nav-link" to="/search">
                    <span className="fa fa-search fa-lg" /> Search
                  </NavLink>
                </NavItem>
                {this.props.auth.isAuthenticated &&
                this.props.auth.userinfo.admin ? (
                  <React.Fragment>
                    <NavItem
                      onClick={this.toggleNavBar}
                      className="ml-2 mt-1 homeButton"
                    >
                      <NavLink className="nav-link " to="/issue">
                        <span className="fa fa-plus-square" /> Issue Book
                      </NavLink>
                    </NavItem>
                    <NavItem
                      onClick={this.toggleNavBar}
                      className="ml-2 mt-1 homeButton"
                    >
                      <NavLink className="nav-link " to="/return">
                        <span className="fa fa-list-ul" /> Return Book
                      </NavLink>
                    </NavItem>
                    <NavItem
                      onClick={this.toggleNavBar}
                      className="ml-2 mt-1 homeButton"
                    >
                      <NavLink className="nav-link " to="/stats">
                        <span className="fa fa-info-circle" /> Stats
                      </NavLink>
                    </NavItem>
                  </React.Fragment>
                ) : (
                  <div />
                )}

                {this.props.auth.isAuthenticated &&
                !this.props.auth.userinfo.admin ? (
                  <NavItem
                    onClick={this.toggleNavBar}
                    className="ml-2 mt-1 homeButton"
                  >
                    <NavLink className="nav-link" to="/history">
                      <span className="fa fa-history" /> Issue history
                    </NavLink>
                  </NavItem>
                ) : (
                  <div />
                )}

                {this.props.auth.isAuthenticated ? (
                  <NavItem
                    onClick={this.toggleNavBar}
                    className="ml-2 mt-1 homeButton"
                  >
                    <NavLink className="nav-link" to="/profile">
                      <span className="fa fa-user-circle-o fa-lg" /> My Profile
                    </NavLink>
                  </NavItem>
                ) : (
                  <div />
                )}
              </Nav>

              <Nav className="ml-auto " navbar>
                <NavItem>
                  {!this.props.auth.isAuthenticated ? (
                    <Button
                      outline
                      className="unAuthBtns"
                      onClick={this.toggleModal}
                    >
                      <span className="fa fa-sign-in fa-lg"></span> Sign-in
                      {this.props.auth.isLoading ? (
                        <span className="fa fa-spinner fa-pulse fa-fw"></span>
                      ) : null}
                    </Button>
                  ) : (
                    <div className="authUsername">
                      <div className="navbar-text mr-3 ">
                        {this.props.auth.user.username}
                      </div>
                      <Button
                        outline
                        className="logoutBtn"
                        onClick={this.toggleSignout}
                      >
                        <span className="fa fa-sign-out fa-lg"></span> LOGOUT
                        {this.props.auth.isLoading ? (
                          <span className="fa fa-spinner fa-pulse fa-fw"></span>
                        ) : null}
                      </Button>
                    </div>
                  )}

                  <EnableSignUp
                    isSignedIn={this.props.auth.isAuthenticated}
                    toggleSignup={() => {
                      this.toggleSignup();
                    }}
                  />
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>

        <Modal
          isOpen={!this.props.auth.isAuthenticated && this.state.isModalOpen}
          toggle={this.toggleModal}
        >
          <ModalHeader className="signInModalHeader" toggle={this.toggleModal}>
            Sign-In
          </ModalHeader>
          <ModalBody className="signInModalBody">
            <Form onSubmit={this.toggleSignin}>
              <FormGroup>
                <Label htmlFor="username">Username:</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username .."
                  innerRef={(input) => (this.username = input)}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password .."
                  innerRef={(input) => (this.password = input)}
                />
              </FormGroup>
              <Button className="signInModalBtn" type="submit" value="submit">
                Login
              </Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.isSignUpOpen} toggle={this.toggleSignup}>
          <ModalHeader className="signUpModalHeader" toggle={this.toggleSignup}>
            Sign-up
          </ModalHeader>
          <ModalBody className="signUpModalBody">
            <LocalForm
              model="user"
              onSubmit={(values) => {
                this.toggleSignup();
                this.props.signupUser({
                  username: values.username,
                  password: values.password,
                  email: values.email,
                  rollNumber: values.rollNumber,
                  firstname: values.firstname,
                  lastname: values.lastname,
                });
              }}
            >
              <FormGroup>
                <Label htmlFor="username">Username:</Label>
                <Control.text
                  model=".username"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  validators={{
                    required,
                    minLen: minLen(3),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".username"
                  show="touched"
                  messages={{
                    minLen: "Must be greater than 2 characters",
                    maxLen: "Must be 20 characters or less",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password:</Label>
                <Control.password
                  model=".password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".password"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 5 characters",
                    maxLen: " Must be 20 characters or less",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="firstname">First Name:</Label>
                <Control.text
                  model=".firstname"
                  id="firstname"
                  name="firstname"
                  className="form-control"
                  placeholder="First Name"
                  validators={{
                    required,
                    minLen: minLen(3),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".firstname"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 2 characters",
                    maxLen: " Must be 20 characters or less",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="lastname">Last Name:</Label>
                <Control.text
                  model=".lastname"
                  id="lastname"
                  name="lastname"
                  className="form-control"
                  placeholder="Last Name"
                  validators={{
                    required,
                    minLen: minLen(3),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".lastname"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 2 characters",
                    maxLen: " Must be 20 characters or less",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="rollNumber">Roll No:</Label>
                <Control.text
                  model=".rollNumber"
                  id="rollNumber"
                  name="rollNumber"
                  className="form-control"
                  placeholder="Roll No:"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(6),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".No"
                  show="touched"
                  messages={{
                    minLen: " Must be 6 numbers",
                    maxLen: " Must be 6 numbers",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email:</Label>
                <Control.text
                  model=".email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email:"
                  validators={{ required, validEmail }}
                />
                <Errors
                  className="text-danger"
                  model=".email"
                  show="touched"
                  messages={{
                    validEmail: " Enter a valid email",
                  }}
                />
              </FormGroup>
              <Button className="signUpModalBtn" type="submit" value="submit">
                Register
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Header;
