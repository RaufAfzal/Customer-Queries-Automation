import axiosInstance from "../../app/axiosInstance"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axiosInstance.get('users')
    return response.data
})

export const addNewUser = createAsyncThunk('users/addNewUser', async (newUser) => {
    const response = await axiosInstance.post('users', newUser)
    return response.data
})

export const updateUser = createAsyncThunk('users/updateUser', async (existingUser) => {
    try {
        const response = await axiosInstance.patch(`users`, existingUser)
        return response.data;
    } catch (err) {
        return existingUser;
    }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (existingUser, { rejectWithValue }) => {
    const { _id } = existingUser
    try {
        const response = await axiosInstance.delete(`users/${existingUser._id}`, existingUser)
        if (response?.status === 200) {
            return { _id, message: response.data.message };
        } else {
            return rejectWithValue('Failed to delete the post');
        }
    } catch (err) {
        return rejectWithValue('Failed to delete the post')
    }
})