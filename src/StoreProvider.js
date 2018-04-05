import {applyMiddleware, createStore} from "redux";
import allReducers from "./reducers";
import logger from "redux-logger";
const Store = createStore(
  allReducers,
  applyMiddleware(logger, require('redux-immutable-state-invariant').default()), // for dev purpose only
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default Store;
