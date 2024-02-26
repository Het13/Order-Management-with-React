import {
    CART_EMPTIED,
    PRODUCT_ADDED,
    PRODUCT_REMOVED,
    QUANTITY_DECREASED,
    QUANTITY_INCREASED
} from '../actions/actionTypes';

const initialState = {
    cart: []
};

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case PRODUCT_ADDED:
            const existingProductIndex = state.cart.findIndex(item => item.id === action.payload.id);

            if (existingProductIndex !== -1) {
                const updatedCart = [...state.cart];
                updatedCart[existingProductIndex].quantity += 1;
                return {...state, cart: updatedCart};
            } else {
                return {...state, cart: [...state.cart, {...action.payload, quantity: 1}]};
            }

        case PRODUCT_REMOVED:
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload.id)
            };

        case QUANTITY_INCREASED:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id ? {...item, quantity: item.quantity + 1} : item
                )
            };

        case QUANTITY_DECREASED:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id && item.quantity > 1 ? {...item, quantity: item.quantity - 1} : item
                )
            };

        case CART_EMPTIED:
            return {
                cart: []
            };

        default:
            return state;
    }
}

export default cartReducer;



