import { configureStore } from '@reduxjs/toolkit'
import AuthSlice, { authReducer } from '../features/auth/AuthSlice'
import notesReducer from "../features/notes/NotesSlice"
import usersReducer from "../features/users/UsersSlice"
import { setStore } from './api/axiosInstance'
import storageSession from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";


const authTokenPersistConfig = {
    key: "auth",
    storage: storageSession,
};

// const middleware = [
//     ...getDefaultMiddleware({
//         serializableCheck: {
//             ignoredActions: [persistPersist, persistFlush, persistRehydrate], // Ignore persist actions
//         },
//     }),
// ];

const persistedAuthReducer = persistReducer(authTokenPersistConfig, authReducer);

export const store = configureStore({
    reducer: {
        notes: notesReducer,
        users: usersReducer,
        auth: persistedAuthReducer,

    },
    // middleware

})
setStore(store)
export const persistor = persistStore(store);