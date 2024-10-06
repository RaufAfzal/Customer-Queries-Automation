import { createSlice } from "@reduxjs/toolkit"
import { fetchNotes, addNewNote, updateNote, deleteNote } from "./notesApi"


const initialState = {
    notes: [],
    status: 'idle',
    error: null
}


export const NotesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            //Fetch a note
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message
            })
            //Create a note
            .addCase(addNewNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })
            //Update a note
            .addCase(updateNote.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.notes.findIndex((note) => note._id === action.payload._id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            //Delete a note
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.status = "succeeded"
                const note = state.notes.filter(note => note._id !== action.payload._id);
                state.notes = note
            })
    }
})




export default NotesSlice.reducer
