import * as types from "../types";

const Users = (
  state = { isLoading: true, errMsg: null, users: [] },
  action
) => {
  switch (action.type) {
    case types.ADD_USERS:
      return {
        ...state,
        isLoading: false,
        errMsg: null,
        users: action.payload,
      };
    case types.USERS_LOADING:
      return { ...state, isLoading: true, errMsg: null, users: [] };

    case types.USERS_FAILED:
      return { ...state, isLoading: false, errMsg: action.payload };

    default:
      return state;
  }
};
export default Users;
