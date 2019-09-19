import { combineReducers } from "redux";
import { SET_USER, CLEAR_USER } from "../actions/types";


const INIT_STATE = {
    currentUser: null,
    isLoading: true
}
const user_reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload.currentUser,
                isLoading: false,
            };
        case CLEAR_USER:
            return {
                ...INIT_STATE,
                isLoading: false,
            };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
})
export default rootReducer;