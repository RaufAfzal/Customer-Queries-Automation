import { createSlice } from "@reduxjs/toolkit";
import { login, refresh, logout } from "./authApi";

const initialState = {
    user: null,
    accessToken: null,
    status: 'idle',
    error: null,
}

const AuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login Cases
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                const decoded = parseJwt(action.payload.accessToken);
                state.user = decoded.UserInfo;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Refresh Token Cases
            .addCase(refresh.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(refresh.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                const decoded = parseJwt(action.payload.accessToken);
                state.user = decoded.UserInfo;
            })
            .addCase(refresh.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.user = null;
                state.accessToken = null;
            })

            // Logout Cases
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'succeeded';
                state.user = null;
                state.accessToken = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    }
})


// Helper function to decode JWT(without verifying signature)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default AuthSlice.reducer;
