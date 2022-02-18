import React, { Component } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

function UserDetail({ user, Num }) {
  return (
    <React.Fragment>
      <td>{Num}</td>
      <td>
        <Link to={`/users/${user._id}`}>
          {user.firstname + " " + user.lastname}
        </Link>
      </td>
      <td>{user.rollNumber}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
    </React.Fragment>
  );
}

class UsersListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Num = 1;
  }
  render() {
    if (this.props.usersLoading) {
      return (
        <div className="container">
          <div className="row">
            <Spinner/>
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
              <h3>{this.props.errMsg}</h3>
            </div>
          </div>
        </div>
      );
    } else if (this.props.users.length === 0) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12 text-center">
              <br />
              <br />
              <br />
              <br />
              <h4>{"No users found"}</h4>
            </div>
          </div>
        </div>
      );
    } else {
      const listofUsers = this.props.users.map((user) => {
        return (
          <tr key={user._id}>
            <UserDetail user={user} Num={this.Num++} />
          </tr>
        );
      });

      return (
        <div className="container listOfUsersComponent">
          <div className="row">
            <div className="col-12">
              <h3 className="usersListHeader">
                List of{" "}
                {this.props.users[0].admin
                  ? " admins in-charge"
                  : " students registered"}
              </h3>
              <Table  striped bordered hover responsive>
                <thead className="usersListTableHeader">
                  <tr>
                    <th>No.</th>
                    <th>
                      Name of{" "}
                      {this.props.users[0].admin ? " admin" : " student"}
                    </th>
                    <th>
                      {this.props.users[0].admin ? " Admin Id" : " Roll No."}
                    </th>
                    <th>Username</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>{listofUsers}</tbody>
              </Table>
              <br />
              <br />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UsersListPage;
