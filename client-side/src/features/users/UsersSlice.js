import { createSlice } from "@reduxjs/toolkit"
import { fetchUsers, addNewUser, updateUser, deleteUser } from "./usersApi"


const initialState = {
    users: [],
    status: 'idle',
    error: null
}


export const UsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            //Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message
            })
            //Create a user
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            //Update a user
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.users.findIndex((note) => note._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            //Delete a user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = "succeeded"
                const user = state.users.filter(user => user._id !== action.payload._id);
                state.users = user
            })
    }
})

export default UsersSlice.reducer