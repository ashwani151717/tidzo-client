import { combineReducers } from "redux";
import { userSlice } from "./reducer/userSlice";
import reelReducer from "./reducer/reelSlice";
import followingReducer from "./reducer/followingSlice";
import likeReducer from "./reducer/likeSlice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    reel: reelReducer,
    following: followingReducer,
    like: likeReducer,
});
  
export default rootReducer; 