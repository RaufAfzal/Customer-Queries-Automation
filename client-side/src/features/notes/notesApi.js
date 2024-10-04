import axiosInstance from "../../app/axiosInstance"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const response = await axiosInstance.get('notes')
    return response.data
})

export const addNewNote = createAsyncThunk('notes/addNewPost', async (noteData) => {
    const response = await axiosInstance.post('notes', noteData)
    return response.data
})

export const updateNote = createAsyncThunk('notes/updateNote', async (noteData) => {
    try {
        const response = await axiosInstance.put(`notes/${noteData._id}`, noteData)
        return response.data;
    } catch (err) {
        return noteData;
    }
})

export const deleteNote = createAsyncThunk('notes/deleteNote', async (noteData, { rejectWithValue }) => {
    const { _id } = noteData
    try {
        const response = await axiosInstance.delete(`notes/${noteData._id}`, noteData)
        if (response?.status === 200) {
            return { _id, message: response.data.message };
        } else {
            return rejectWithValue('Failed to delete the post');
        }
    } catch (err) {
        return rejectWithValue('Failed to delete the post')
    }
})