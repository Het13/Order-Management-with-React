import {LOGIN_SUCCESS} from "../actions/actionTypes";


const initialState = {
    user: {
        name: null,
        jwtToken: null,
        customerId: null,
        isAuthenticated: false
    }
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                name: action.payload.name,
                jwtToken: action.payload.jwtToken,
                customerId: action.payload.customerId,
                isAuthenticated: action.payload.isAuthenticated
            }
        default:
            return state;
    }
}

export default userReducer;