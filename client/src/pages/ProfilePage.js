import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Label,
  CardText,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
} from "reactstrap";
import { Control, LocalForm, Errors } from "react-redux-form";

//validators

const required = (val) => val && val.length;
const maxLen = (len) => (val) => !val || val.length <= len;
const minLen = (len) => (val) => val && val.length >= len;
const validEmail = (val) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const credentialsMatch = (original) => (val) => val === original;

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfModalOpen: false,
      isChangePassModalOpen: false,
    };
    this.toggleEditProfModal = this.toggleEditProfModal.bind(this);
    this.toggleChangePassModal = this.toggleChangePassModal.bind(this);
  }


  toggleChangePassModal() {
    this.setState({
      isChangePassModalOpen: !this.state.isChangePassModalOpen,
    });
  }

  toggleEditProfModal() {
    this.setState({ isEditProfModalOpen: !this.state.isEditProfModalOpen });
  }

  render() {
    
    if (this.props.auth.userinfo === null) {
      return (
        <div className="row heading">
          Failed to fetch. Please reload the page
        </div>
      );
    }
    return (
      <div className="container profileComponent">
        <div>
          <Card >
            <CardHeader className="cardHeader">
              <h3> Your Profile</h3>
            </CardHeader >
            <CardBody className="cardBody">
              <CardText>
                <h5>
                  {" "}
                  First Name :{" "}
                  {"          " + this.props.auth.userinfo.firstname}
                </h5>
                <h5>
                  {" "}
                  Last Name : {"          " + this.props.auth.userinfo.lastname}
                </h5>
                <h5>
                  {" "}
                  {this.props.auth.userinfo.admin
                    ? "Admin Id: "
                    : "Roll No"}{" "}
                  : {"          " + this.props.auth.userinfo.rollNumber}
                </h5>
                <h5>
                  {" "}
                  Email : {"          " + this.props.auth.userinfo.email}
                </h5>
              </CardText>
              <Button className="profbtn" onClick={this.toggleEditProfModal}>
                Edit &nbsp;
                <span className="fa fa-pencil" />
              </Button>{" "}
              {this.props.auth.userinfo.admin ? (
                <div />
              ) : (
                <Button className="profbtn" onClick={this.toggleChangePassModal}>
                  Change Password &nbsp;{"   "}
                  <span className="fa fa-key" />
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
        <Modal
          isOpen={this.state.isEditProfModalOpen}
          toggle={this.toggleEditProfModal}
        >


          <ModalHeader className="signUpModalHeader" toggle={this.toggleEditProfModal}>Edit Profile</ModalHeader>
          <ModalBody className="signUpModalBody">
            <LocalForm
              model="user"
              onSubmit={(values) => {
                this.toggleEditProfModal();
                this.props.editUser(
                  this.props.auth.userinfo._id,
                  values.firstname,
                  values.lastname,
                  values.rollNumber,
                  values.email
                );
              }}
            >
              <FormGroup>
                <Label htmlFor="firstname">First Name</Label>
                <Control.text
                  model=".firstname"
                  id="firstname"
                  name="firstname"
                  className="form-control"
                  defaultValue={this.props.auth.userinfo.firstname}
                  placeholder="Your First Name"
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
                    minLen: "Must be greater than 2 characters",
                    maxLen: "Must be 20 characters or less",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="lastname">Last Name</Label>
                <Control.text
                  model=".lastname"
                  id="lastname"
                  name="lastname"
                  className="form-control"
                  defaultValue={this.props.auth.userinfo.lastname}
                  placeholder="Your Last Name"
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
                <Label htmlFor="rollNumber">Roll No.</Label>
                <Control.text
                  model=".rollNumber"
                  id="rollNumber"
                  name="rollNumber"
                  className="form-control"
                  defaultValue={this.props.auth.userinfo.rollNumber}
                  placeholder="Your Roll No:"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(6),
                  }}
                  disabled
                />
                <Errors
                  className="text-danger"
                  model=".rollNumber"
                  show="touched"
                  messages={{
                    minLen: " Must be 6 numbers",
                    maxLen: " Must be 6 numbers",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">E-mail</Label>
                <Control.text
                  model=".email"
                  id="email"
                  name="email"
                  defaultValue={this.props.auth.userinfo.email}
                  className="form-control"
                  placeholder="email"
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
              <Button type="submit" value="submit" className="signUpModalBtn">
                Confirm
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isChangePassModalOpen}
          toggle={this.toggleChangePassModal}
        >
          <ModalHeader className="signUpModalHeader" toggle={this.toggleChangePassModal}>
            Change Password
          </ModalHeader>
          <ModalBody className="signUpModalBody">
            <LocalForm
              model="passwordform"
              onSubmit={(values) => {
                if (values.newpassword === values.confirm) {
                  this.toggleChangePassModal();
                  this.props.editPassword(
                    this.props.auth.userinfo._id,
                    this.props.auth.user.username,
                    values.newpassword
                  );
                } else {
                  alert("Your passwords didn't match. Please try again");
                }
              }}
            >
              <FormGroup>
                <Label htmlFor="password">Current Password</Label>
                <Control.password
                  model=".password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="password"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(20),
                    credentialsMatch: credentialsMatch(this.props.auth.user.password),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".password"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 5 characters",
                    maxLen: " Must be 20 characters or less",
                    credentialsMatch: " Enter the correct password",
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="newpassword">New password</Label>
                <Control.password
                  model=".newpassword"
                  id="newpassword"
                  name="newpassword"
                  className="form-control"
                  placeholder="New Password"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".newpassword"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 5 characters",
                    maxLen: " Must be 20 characters or less",
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Control.password
                  model=".confirm"
                  id="confirm"
                  name="confirm"
                  className="form-control"
                  placeholder="Re-enter the new password"
                  validators={{
                    required,
                    minLen: minLen(6),
                    maxLen: maxLen(20),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".confirm"
                  show="touched"
                  messages={{
                    minLen: " Must be greater than 5 characters",
                    maxLen: " Must be 20 characters or less",
                  }}
                />
              </FormGroup>

              <Button type="submit" value="submit" className="signUpModalBtn">
                Confirm
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ProfilePage;
