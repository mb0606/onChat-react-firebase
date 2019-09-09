import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";


const INIT_STATE = {
    currentUser: null,
    isLoading: true
}
const user_reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                currentUser: action.payload.currentUser,
                isLoading: false,
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
})
export default rootReducer;