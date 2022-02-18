import React, { Component } from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function BookDetail({
  book,
  toggleChange,
  isAdmin,
  toggleDeleteModal,
  toggleEditModal,
  Num,
}) {
  return (
    <React.Fragment>
      <td> {Num} </td>
      <td className="booklistName">
        <Link to={`/books/${book._id}`}> {book.name} </Link>
      </td>
      <td className="booklistISBN"> {book.isbn} </td>
      <td className="booklistAuthorName"> {book.author} </td>
      <td className="booklistCopies"> {book.copies} </td>
      {isAdmin ? (
        <td>
          &nbsp; &nbsp; &nbsp; &nbsp; 
          <span
            onClick={() => {
              toggleChange(book._id);
              toggleEditModal();
            }}
            className="Option fa fa-pencil"
          />
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          <span
            onClick={() => {
              toggleChange(book._id);
              toggleDeleteModal();
            }}
            className="Option fa fa-ban"
          />
        </td>
      ) : (
        <div />
      )}
    </React.Fragment>
  );
}

class booksListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Num = 1;
  }

  render() {
    const listofBooks = this.props.books.map((book) => {
      return (
        <tr key={book.name}>
          <BookDetail
            book={book}
            isAdmin={this.props.isAdmin}
            toggleChange={this.props.toggleChange}
            toggleDeleteModal={this.props.toggleDeleteModal}
            toggleEditModal={this.props.toggleEditModal}
            Num={this.Num++}
          />
        </tr>
      );
    });

    if (this.props.booksLoading) {
      return (
        <div className="container">
          <div className="row">
            <Spinner />
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
        <div className="container">
          <div className="row">
            <div className="col-12 bookList">
              <h3 className="bookListTitle" align="center">Current Books in the Library</h3>
              <Table striped bordered hover responsive>
                <thead  className="  bookListTableHead">
                  <tr>
                    <th>No.</th>
                    <th>Name of Book</th>
                    <th>ISBN number</th>
                    <th>Authors</th>
                    <th>Copies Available</th>
                    {this.props.isAdmin ? (
                      <th >
                        Edit /  Delete
                      </th>
                    ) : (
                      <React.Fragment />
                    )}
                  </tr>
                </thead>
                <tbody className="bookListTableBody">{listofBooks}</tbody>
              </Table>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default booksListPage;


