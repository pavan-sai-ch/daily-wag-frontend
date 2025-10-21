import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // add more reducers here for other features
        // e.g., cart: cartReducer,
    },
});