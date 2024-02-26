import {
    CART_EMPTIED,
    LOGIN_SUCCESS,
    PRODUCT_ADDED,
    PRODUCT_REMOVED,
    QUANTITY_DECREASED,
    QUANTITY_INCREASED
} from './actionTypes';

export const addToCart = (product) => ({
    type: PRODUCT_ADDED,
    payload: product,
});

export const removeFromCart = (productId) => ({
    type: PRODUCT_REMOVED,
    payload: {
        id: productId
    }
});

export const increaseQuantity = (productId) => ({
    type: QUANTITY_INCREASED,
    payload: {
        id: productId
    }
});

export const decreaseQuantity = (productId) => ({
    type: QUANTITY_DECREASED,
    payload: {
        id: productId
    }
});

export const emptyCart = () => ({
    type: CART_EMPTIED
})

export const loginSuccess = (userName, token, isAuth) => ({
    type: LOGIN_SUCCESS,
    payload: {
        name: userName,
        jwtToken: token,
        isAuthenticated: isAuth
    }
})