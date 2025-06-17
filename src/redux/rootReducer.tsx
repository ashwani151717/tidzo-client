import { combineReducers } from "redux";
import { userSlice } from "./reducer/userSlice";
import reelReducer from "./reducer/reelSlice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    reel: reelReducer,
});
  
export default rootReducer; 