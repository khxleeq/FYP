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



class ProfilePage extends Component {



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
                <div />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default ProfilePage;
