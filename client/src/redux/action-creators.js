import * as types from "./types";
import { baseURI } from "../baseURI";
import { json } from "body-parser";

// /books API FETCH CALLS (books)

export const addBook = (book) => ({
  type: types.ADD_BOOK,
  payload: book,
});

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

export const editBookdispatch = (books) => ({
  type: types.EDIT_BOOK,
  payload: books,
});

export const editBook =
  (_id, name, author, desc, isbn, cat, floor, shelf, copies) => (dispatch) => {
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

export const deleteBookdispatch = (resp) => ({
  type: types.DELETE_BOOK,
  payload: resp,
});

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

export const addBooks = (books) => ({
  type: types.ADD_BOOKS,
  payload: books,
});

export const booksFailed = (errmsg) => ({
  type: types.BOOKS_FAILED,
  payload: errmsg,
});

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
        var errmsg = new Error(error.message);
        throw errmsg;
      }
    )
    .then((response) => response.json())
    .then((books) => dispatch(addBooks(books)))
    .catch((error) => dispatch(booksFailed(error.message)));
};

// /users API FETCH CALLS (auth)

export const usersLoading = () => ({
  type: types.USERS_LOADING,
});

export const addUsers = (users) => ({
  type: types.ADD_USERS,
  payload: users,
});

export const usersFailed = (errmsg) => ({
  type: types.USERS_FAILED,
  payload: errmsg,
});

export const fetchUsers = () => (dispatch) => {
  const bearerToken = "Bearer " + localStorage.getItem("token");
  dispatch(usersLoading(true));
  return fetch(baseURI + "users", {
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
        var errmsg = new Error(error.message);
        throw errmsg;
      }
    )
    .then((response) => response.json())
    .then((users) => dispatch(addUsers(users)))
    .catch((error) => dispatch(usersFailed(error.message)));
};

export const reqSignin = (creds) => {
  return {
    type: types.SIGNIN_REQUEST,
    creds,
  };
};

export const getsSignin = (response) => {
  return {
    type: types.SIGNIN_SUCCESS,
    token: response.token,
    userinfo: response.userinfo,
  };
};

export const signinError = (message) => {
  return {
    type: types.SIGNIN_FAILURE,
    message,
  };
};

export const signinUser = (creds) => (dispatch) => {
  dispatch(reqSignin(creds));
  return fetch(baseURI + "users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
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
      if (response.success) {
        // If login was successful, set the token in local storage
        localStorage.setItem("token", response.token);
        localStorage.setItem("creds", JSON.stringify(creds));
        localStorage.setItem("userinfo", JSON.stringify(response.userinfo));
        dispatch(fetchIssues(!response.userinfo.admin));
        if (response.userinfo.admin) {
          dispatch(fetchUsers());
        }
        setTimeout(() => {
          logoutUser();
          alert("Timeout. Please sign-in again.");
        }, 3600 * 1000);
        // Dispatch the success action
        dispatch(getsSignin(response));
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => {
      alert(error.message + "\n" + "Username and password did not match");
      return dispatch(signinError(error.message));
    });
};

export const signupUser = (creds) => (dispatch) => {
  return fetch(baseURI + "users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
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
      if (response.success) {
        // If Registration was successful, alert the user
        alert("Sign-up successful");
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) =>
      alert(error.message + "\n" + "Username, email or rollNo. already exist!")
    );
};

export const reqSignout = () => {
  return {
    type: types.SIGNOUT_REQUEST,
  };
};

export const getsSignout = () => {
  return {
    type: types.SIGNOUT_SUCCESS,
  };
};

export const signoutUser = () => (dispatch) => {
  dispatch(reqSignout());
  localStorage.removeItem("token");
  localStorage.removeItem("creds");
  localStorage.removeItem("userinfo");
  dispatch(getsSignout());
};

export const editUserDispatch = (USER) => ({
  type: types.EDIT_USER,
  payload: USER,
});

export const editUser =
  (_id, firstname, lastname, rollNumber, email) => (dispatch) => {
    const newUser = {
      firstname: firstname,
      lastname: lastname,
      rollNumber: rollNumber,
      email: email,
    };
    const bearerToken = "Bearer " + localStorage.getItem("token");
    return fetch(baseURL + "users/" + _id, {
      method: "PUT",
      body: JSON.stringify(newUser),
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
        localStorage.removeItem("userinfo");
        localStorage.setItem("userinfo", JSON.stringify(response));
        return dispatch(editUserDispatch(response));
      })
      .catch((error) => {
        alert(
          "Your profile failed to edit\nError: " +
            error.message +
            "\n These credentials already exist!"
        );
      });
  };

export const editPasswordDispatch = (CREDS) => ({
  type: types.EDIT_PASSWORD,
  payload: CREDS,
});

export const editPassword = (_id, username, password) => (dispatch) => {
  const bearerToken = "Bearer " + localStorage.getItem("token");
  return fetch(baseURL + "users/password/" + _id, {
    method: "PUT",

    body: JSON.stringify({ password: password }),
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
            "Error " + response.status + ": " + response.statusText + "\n "
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
      let newCreds = { username: username, password: password };
      localStorage.removeItem("creds");
      localStorage.setItem("creds", JSON.stringify(newCreds));
      alert("Password changed successfully");
      return dispatch(editPasswordDispatch(newCreds));
    })
    .catch((error) => {
      alert("Your password could not be changed\nError: " + error.message);
    });
};

// /issues API FETCH CALLS (issues)

export const addIssue = (issue) => ({
  type: types.ADD_ISSUE,
  payload: issue,
});

export const postIssue = (bookId, studentId) => (dispatch) => {
  const newIssue = {
    book: bookId,
    student: studentId,
  };

  const bearerToken = "Bearer " + localStorage.getItem("token");
  return fetch(baseURI + "issues", {
    method: "POST",
    body: JSON.stringify(newIssue),
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
      alert("Book issued successfully");
      return dispatch(addIssue(response));
    })
    .catch((error) => {
      alert(
        "This book could not be issued\nError: " +
          error.message +
          "\n" +
          "Either the book is unavailable or the student has reached their limit of books they can borrow. They should return books before they request for more."
      );
    });
};

export const returnBookDispatch = (issue) => ({
  type: types.RETURN_ISSUE,
  payload: issue,
});

export const returnIssue = (issueId) => (dispatch) => {
  const bearerToken = "Bearer " + localStorage.getItem("token");
  return fetch(baseURL + "issues/" + issueId, {
    method: "PUT",
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
      alert("Book returned successfully");
      return dispatch(returnBookDispatch(response));
    })
    .catch((error) => {
      alert("The book could not be returned\nError: " + error.message);
    });
};

export const addIssues = (issues) => ({
  type: types.ADD_ISSUES,
  payload: issues,
});

export const addIssues = (issues) => ({
  type: types.ADD_ISSUES,
  payload: issues,
});

export const issuesFailed = (errmsg) => ({
  type: types.ISSUES_FAILED,
  payload: errmsg,
});

export const fetchIssues = (student) => (dispatch) => {
  let issueURL;
  const bearerToken = "Bearer " + localStorage.getItem("token");
  if (student) {
    issueURL = "issues/student";
  } else {
    issueURL = "issues";
  }
  dispatch(issuesLoading(true));
  return fetch(baseURL + issueURL, {
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
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((issues) => dispatch(addIssues(issues)))
    .catch((error) => dispatch(issuesFailed(error.message)));
};
