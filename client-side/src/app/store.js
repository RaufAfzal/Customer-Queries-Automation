import { configureStore } from '@reduxjs/toolkit'
import notesReducer from "../features/notes/NotesSlice"
import usersReducer from "../features/users/UsersSlice"
export const store = configureStore({
    reducer: {
        notes: notesReducer,
        users: usersReducer

    }

})