import React, { Component } from "react";
import {
  Card,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

class StatsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Num = 1;
  }


  render() {
    if (
      this.props.issues.isLoading ||
      this.props.booksLoading ||
      this.props.usersLoading
    ) {
      return (
        <div className="container">
          <div className="row">
            <Spinner />
          </div>
        </div>
      );
    } else if (this.props.issues.errMsg) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.issues.errMsg}</h3>
            </div>
          </div>
        </div>
      );
    } else if (this.props.usersErrMsg) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.usersErrMsg}</h3>
            </div>
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
    } else {
      return (
        <div className="container statsCardComponent ">
          <div className="row">
            <div className="col-12 col-md-6 col-xl-4 mt-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h1>{this.props.books.length}</h1>
                  </CardTitle>
                  <CardText>Different books available</CardText>
                  <CardLink tag={Link} to="/books">
                    <Button className="viewBtn">
                      <i className="fa fa-eye fa-lg" /> &nbsp;View
                    </Button>
                  </CardLink>
                </CardBody>
              </Card>
            </div>

            <div className="col-12 col-md-6 col-xl-4 mt-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h1>{this.props.issues.issues.length}</h1>
                  </CardTitle>
                  <CardText>Books Issued</CardText>
                  <CardLink tag={Link} to="/log">
                    <Button className="viewBtn">
                      <i className="fa fa-eye fa-lg" /> &nbsp;View
                    </Button>
                  </CardLink>
                </CardBody>
              </Card>
            </div>
            <div className="col-12 col-md-6 col-xl-4 mt-4">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h1>
                      {
                        this.props.issues.issues.filter(
                          (issue) => !issue.returned
                        ).length
                      }
                    </h1>
                  </CardTitle>
                  <CardText>Books not yet returned</CardText>
                  <CardLink>
                    <Button tag={Link} to="/return" className="viewBtn">
                      <i className="fa fa-eye fa-lg" /> &nbsp;View
                    </Button>
                  </CardLink>
                </CardBody>
              </Card>
            </div>
            <div className="col-12 col-md-6 col-xl-6 mt-5">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h1>
                      {this.props.users.filter((user) => !user.admin).length}
                    </h1>
                  </CardTitle>
                  <CardText>Students registered</CardText>
                  <CardLink tag={Link} to="/liststudents">
                    <Button className="viewBtn">
                      <i className="fa fa-eye fa-lg" /> &nbsp;View
                    </Button>
                  </CardLink>
                </CardBody>
              </Card>
            </div>
            <div className="col-12 col-md-6 col-xl-6 mt-5">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h1>
                      {this.props.users.filter((user) => user.admin).length}
                    </h1>
                  </CardTitle>
                  <CardText>Admins registered</CardText>
                  <CardLink tag={Link} to="/listadmins">
                    <Button className="viewBtn">
                      <i className="fa fa-eye fa-lg" /> &nbsp;View
                    </Button>
                  </CardLink>
                </CardBody>
              </Card>
            </div>
          </div>

          <br />
        </div>
      );
    }
  }
}

export default StatsPage;
