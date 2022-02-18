
import * as types from "../types";

const Auth = (
  state = {
    isLoading: false,
    isAuthenticated: localStorage.getItem("token") ? true : false,
    token: localStorage.getItem("token"),
    user: localStorage.getItem("creds")
      ? JSON.parse(localStorage.getItem("creds"))
      : null,
    userinfo: localStorage.getItem("userinfo")
      ? JSON.parse(localStorage.getItem("userinfo"))
      : null,
    errMsg: null,
  },
  action
) => {
  switch (action.type) {
    case types.SIGNIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
        user: action.creds,
      };
    case types.SIGNIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        errMsg: "",
        token: action.token,
        userinfo: action.userinfo,
      };
    case types.SIGNIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        errMsg: action.message,
      };
    case types.SIGNOUT_REQUEST:
      return { ...state, isLoading: true, isAuthenticated: true };

    case types.SIGNOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: "",
        user: null,
        userinfo: null,
      };

    case types.EDIT_USER:
      return { ...state, userinfo: action.payload };

    case types.EDIT_PASSWORD:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default Auth;
