import React, { Component } from "react";
import { Card, CardBody, CardHeader, CardText } from "reactstrap";
import Spinner from "../../components/Spinner";

class UserInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className="container">
          <div className="row">
            <Spinner />
          </div>
        </div>
      );
    } else if (this.props.errMsg) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.errMsg}</h3>
            </div>
          </div>
        </div>
      );
    } else
      return (
        <div className="container userDetailComponent">
          <div className="row">
            <Card className="heading">
              <CardHeader className="UserDetailcardHeader">
                <h3>User Details</h3>
              </CardHeader>
              <CardBody className="userlistcardBody">
                <CardText>
                  <h5>
                    First name: {"          " + this.props.user.firstname}
                  </h5>
                  <h5>
                    {" "}
                    Last name: {"          " + this.props.user.lastname}
                  </h5>
                  <h5>
                    {" "}
                    {this.props.user.admin ? "Admin No": "Roll No"}:
                    {"          " + this.props.user.rollNumber}
                  </h5>
                  <h5> Email: {"          " + this.props.user.email}</h5>
                  <h5> Username: {"  " + this.props.user.username}</h5>
                </CardText>
              </CardBody>
            </Card>
          </div>
        </div>
      );
  }
}

export default UserInfoPage;
