import { combineReducers } from "redux";
import { SET_USER, CLEAR_USER, SET_CURRENT_CHANNEL } from "../actions/types";


const INIT_STATE_USER = {
    currentUser: null,
    isLoading: true
}
const user_reducer = (state = INIT_STATE_USER, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload.currentUser,
                isLoading: false,
            };
        case CLEAR_USER:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
}
const INIT_STATE_CHANNEL = {
    currentChannel: null,
}
const channel_reducer = (state = INIT_STATE_CHANNEL, action) => {
    switch (action.type) {
        case SET_CURRENT_CHANNEL: {
            return {
                ...state,
                currentChannel: action.payload.currentChannel
            }
        }
        default: {
            return state;
        }
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer,
})
export default rootReducer;