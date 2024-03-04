import {createStore} from "redux";
import rootReducer from '../reducers/rootReducer'
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root', storage, whitelist: ['cart']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


export default () => {
    let store = createStore(persistedReducer);
    let persistor = persistStore(store);
    return {store, persistor}
};