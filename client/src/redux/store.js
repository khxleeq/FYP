import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import Books from "./reducers/booksReducer";
import Auth from "./reducers/authReducer";
import Issues from "./reducers/issuesReducer";
import Users from "./reducers/usersReducer";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      auth: Auth,
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
};
