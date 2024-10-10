import { configureStore } from '@reduxjs/toolkit'
import notesReducer from "../features/notes/NotesSlice"
import usersReducer from "../features/users/UsersSlice"
import authReducer from '../features/auth/AuthSlice'
import { setStore } from './api/axiosInstance'

export const store = configureStore({
    reducer: {
        notes: notesReducer,
        users: usersReducer,
        auth: authReducer

    }

})

setStore(store)