import * as types from "../types";

const Books = (
  state = { isLoading: true, errMsg: null, books: [] },
  action
) => {
  switch (action.type) {
    case types.ADD_BOOKS:
      return {
        ...state,
        isLoading: false,
        errMsg: null,
        books: action.payload,
      };
    case types.BOOKS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMsg: null,
        books: [],
      };

    case types.BOOKS_FAILED:
      return { ...state, isLoading: false, errMsg: action.payload };

    case types.ADD_BOOK:
      var book = action.payload;
      return { ...state, books: state.books.concat(book) };

    case types.EDIT_BOOK:
      var newbook = action.payload;
      return {
        ...state,
        books: state.books.map((book) => {
          if (book._id === newbook._id) {
            return newbook;
          } else {
            return book;
          }
        }),
      };
    case types.REMOVE_BOOK:
      var resp = action.payload;
      return {
        ...state,
        books: state.books.filter((book) => {
          return book._id !== resp._id;
        }),
      };

    default:
      return state;
  }
};
export default Books;
