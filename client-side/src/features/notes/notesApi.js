import axiosInstance from "../../app/api/axiosInstance"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const response = await axiosInstance.get('notes')
    return response.data
})

export const addNewNote = createAsyncThunk('notes/addNewNote', async (noteData) => {
    const response = await axiosInstance.post('notes', noteData)
    return response.data
})

export const updateNote = createAsyncThunk('notes/updateNote', async (noteData) => {
    try {
        const response = await axiosInstance.patch('notes', noteData)
        return response.data;
    } catch (err) {
        return noteData;
    }
})

export const deleteNote = createAsyncThunk('notes/deleteNote', async (_id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`notes`, { data: { _id } })
        if (response?.status === 200) {
            return { _id, message: response.data.message };
        } else {
            return rejectWithValue('Failed to delete the post');
        }
    } catch (err) {
        return rejectWithValue('Failed to delete the post')
    }
})