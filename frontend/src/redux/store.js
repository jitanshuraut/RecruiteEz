import { createStore } from "redux";
import rootreducer from "./reducers";

const store = createStore(rootreducer, window._REDUX_DEVTOOLS_EXTENSION_ && window._REDUX_DEVTOOLS_EXTENSION_());
export default store;