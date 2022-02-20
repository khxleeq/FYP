import React, { Component } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

const fineRate = 0.5;
let totalFine = 0;
const borrowedDays = 7;

function IssueDetail({ issue, Num }) {
  const dates = [];
  const today = new Date();
  dates.push(today);
  const issueDate = new Date(Date.parse(issue.createdAt));
  const deadline = new Date(Date.parse(issue.createdAt));
  deadline.setDate(deadline.getDate() + 7);
  dates.push(deadline);

  const returnDate = issue.returned
    ? new Date(Date.parse(issue.updatedAt))
    : new Date(Math.min.apply(null, dates));

  let bookFine = 0;

  if (
    (returnDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24) >
    borrowedDays
  ) {
    bookFine =
      Math.floor(
        (returnDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24)
      ) * fineRate;
  }
  totalFine += bookFine;
  return (
    <React.Fragment>
      <td>{Num}</td>
      <td>
        <Link to={`/books/${issue.book._id}`}>{issue.book.name}</Link>
      </td>
      <td>{issue.book.isbn}</td>
      <td>
        {new Intl.DateTimeFormat("en-UK", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(new Date(Date.parse(issue.createdAt)))}
      </td>
      <td>
        {new Intl.DateTimeFormat("en-UK", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(deadline)}
      </td>
      <td>
        {issue.returned
          ? "Returned on " +
            new Intl.DateTimeFormat("en-UK", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }).format(new Date(Date.parse(returnDate)))
          : "Not returned yet"}
      </td>
      <td>{bookFine}</td>
    </React.Fragment>
  );
}


class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Num = 1;
  }

  render() {
    if (this.props.issues.isLoading) {
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
            <div className="col-12 ">
              <br />
              <br />
              <br />
              <br />
              <h3>{this.props.errMsg}</h3>
            </div>
          </div>
        </div>
      );
    } else if (this.props.issues.issues.length === 0) {
      return (
        <div className="container loading">
          <div className="row heading">
            <div className="col-12 text-center">
              <br />
              <br />
              <br />
              <br />
              <h4>{"You have not issued any books."}</h4>
            </div>
          </div>
        </div>
      );
    } else {
      const listOfIssues = this.props.issues.issues.map((issue) => {
        return (
          <tr key={issue._id}>
            <IssueDetail issue={issue} Num={this.Num++} />
          </tr>
        );
      });

      return (
        <div className="container mt-6 historyComponent ">
          <div className="row">
            <div className="col-12 ">
              <h3 >Issue History</h3>
              <Table striped bordered hover responsive>
                <thead className="historyTableHeader">
                  <tr>
                    <th>No.</th>
                    <th>Book Name</th>
                    <th>ISBN No</th>
                    <th>Issue Date</th>
                    <th>Deadline Date</th>
                    <th>Return status</th>
                    <th>Fine (in £)</th>
                  </tr>
                </thead>
                <tbody>{listOfIssues}</tbody>
              </Table>
              <br />
              <h6>
                Total Fine due (if all pending books are returned today) :£
                {totalFine}{" "}
              </h6>
              <br />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default History;
