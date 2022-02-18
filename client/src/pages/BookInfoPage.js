import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardText,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
} from "reactstrap";
import Spinner from "../components/Spinner";

function BookDetail({ book, isAdmin, toggleEditModal, toggleChange }) {
  if (book != null)
    return (
      <Card className="bookInfoCard">
        <CardHeader className="bookinfoCardHeader" align="right" tag="h3">
          <div className="bookInfoName"> {book.name} </div>
          {isAdmin ? (
            <span
              className="fa fa-pencil Option"
              onClick={() => {
                toggleChange(book._id);
                toggleEditModal();
              }}
            />
          ) : (
            <div></div>
          )}
        </CardHeader>
        <CardBody>
          <CardTitle className="bookInfoCardBodyTitle" align="left">
            Author(s): {book.author}
          </CardTitle>
          <CardText className="bookInfoDesc">
            <b> ISBN: </b> {book.isbn} <br />
            <br />
            <b> CATEGORY: </b> {book.cat} <br />
            <br />
            <b>DESCRIPTION: </b>
            <br /> {book.desc} <br />
            <br />
            <br />
            <br />
            <br />
            <b> BOOK LOCATION: </b> <br />
            FLOOR NO: {book.floor} <br />
            SHELF NO: {book.shelf} <br />
            <br />
            <b> COPIES AVAILABLE : </b> {book.copies}
          </CardText>
          <br />
        </CardBody>
        <CardFooter className="bookInfoCardFooter">
          <Row>
            <Col md={6}>
              Created at : &nbsp; 
              {new Intl.DateTimeFormat("en-UK", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(new Date(Date.parse(book.createdAt)))}
            </Col>
            <Col md={6}>
              Last updated at : &nbsp;
              {new Intl.DateTimeFormat("en-UK", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(new Date(Date.parse(book.updatedAt)))}
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  else return <div></div>;
}

class BookInfoPage extends Component {
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
        <div className="container full">
          <div className="row heading">
            <div className="col-12">
              <br /> <br />
              <BookDetail
                book={this.props.book}
                isAdmin={this.props.isAdmin}
                toggleEditModal={this.props.toggleEditModal}
                toggleChange={this.props.toggleChange}
              ></BookDetail>
              <br />
            </div>
          </div>
        </div>
      );
  }
}

export default BookInfoPage;
