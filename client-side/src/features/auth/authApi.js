import axiosInstance from "../../app/api/axiosInstance"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const login = createAsyncThunk('auth/login', async (userObj, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('auth/login', userObj);
        console.log("response is ", response)
        return response.data     //here we will attain access token
    }
    catch (err) {
        const message = err.response.data.message || 'Failed to login please try again.'
        return rejectWithValue(message)
    }

})

export const refresh = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('auth/refresh');
        // console.log(response)
        return response.data    //here we will again get the access token
    }
    catch (err) {
        const message = err.response.data.message || 'Failed to login please try again'
        return rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await axiosInstance.post('auth/logout');
        return true  //logout is successfull
    }
    catch (err) {
        const message = err.response.data.message || 'Failed to logout'
        return rejectWithValue(message)
    }
})

