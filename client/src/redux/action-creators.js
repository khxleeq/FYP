import * as types from "./types";
import { baseURI } from "../baseURI";

// /books api fetch calls//
export const postBook =
  (name, author, desc, isbn, cat, floor, shelf, copies) => (dispatch) => {
    const newBook = {
      name: name,
      author: author,
      desc: desc,
      isbn: isbn,
      cat: cat,
      floor: floor,
      shelf: shelf,
      copies: copies,
    };
    const bearerToken = "Bearer " + localStorage.getItem("token");
    return fetch(baseURI + "books", {
      method: "POST",
      body: JSON.stringify(newBook),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => response.json())
      .then((response) => {
        alert("Your book has been added successfully!");
        return dispatch(addBook(response));
      })
      .catch((error) => {
        alert("Your book could not be added\nError: " + error.message);
      });
  };

export const addBook = (book) => ({
  type: types.ADD_BOOK,
  payload: book,
});

export const editBook =
  (_id, name, author, desc, isbn, cat, floor, shelf, copies) => (dispatch) => {
    const newBook = {
      name: name,
      author: author,
      desc: desc,
      isbn: isbn,
      cat: cat,
      copies: copies,
      shelf: shelf,
      floor: floor,
    };
    const bearerToken = "Bearer " + localStorage.getItem("token");
    return fetch(baseURL + "books/" + _id, {
      method: "PUT",

      body: JSON.stringify(newBook),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => response.json())
      .then((response) => dispatch(editBookdispatch(response)))
      .catch((error) => {
        alert("Your book failed to edit\nError: " + error.message);
      });
  };

export const deleteBook = (_id) => (dispatch) => {
  const bearerToken = "Bearer " + localStorage.getItem("token");
  return fetch(baseURL + "books/" + _id, {
    method: "DELETE",
    headers: {
      Authorization: bearerToken,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((response) => dispatch(deleteBookdispatch(response)))
    .catch((error) => {
      alert("Your book failed to delete\nError: " + error.message);
    });
};

export const fetchBooks = () => (dispatch) => {
  dispatch(booksLoading(true));
  return fetch(baseURL + "books")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((books) => dispatch(addBooks(books)))
    .catch((error) => dispatch(booksFailed(error.message)));
};
