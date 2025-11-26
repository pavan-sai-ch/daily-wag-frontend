import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // No user is logged in initially
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action to handle successful login
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        // Action to handle logout
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;