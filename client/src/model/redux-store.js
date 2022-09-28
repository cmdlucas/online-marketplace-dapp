import { createStore } from "redux";
import reducers from "./redux/reducer/Reducers";

const store = createStore(reducers);

export default store;
