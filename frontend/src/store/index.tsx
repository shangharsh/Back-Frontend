import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from '../slice/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    auth:authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
});

let persistor = persistStore(store);

export default persistor;
