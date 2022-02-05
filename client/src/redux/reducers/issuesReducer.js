import * as types from "../types";

const Issues = (
  state = { isLoading: true, errMsg: null, issues: [] },
  action
) => {
  switch (action.type) {
    case types.ADD_ISSUES:
      return {
        ...state,
        isLoading: false,
        errMsg: null,
        issues: action.payload,
      };

    case types.ISSUES_LOADING:
      return { ...state, isLoading: true, errMsg: null, issues: [] };

    case types.ISSUES_FAILED:
      return { ...state, isLoading: false, errMsg: action.payload };

    case types.ADD_ISSUE:
      var issue = action.payload;
      return { ...state, issues: state.issues.concat(issue) };

    case types.RETURN_ISSUE:
      var newissue = action.payload;
      return {
        ...state,
        issues: state.issues.map((issue) => {
          if (issue._id === newissue._id) {
            return newissue;
          } else {
            return issue;
          }
        }),
      };

    default:
      return state;
  }
};
export default Issues;
