import axios from "axios";

const BASEURL = "http://localhost:3500/";

const axiosInstance = axios.create({
    baseURL: BASEURL,
    withCredentials: true, // Enables sending cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

let injectedStore = null;

export const setStore = (store) => {
    injectedStore = store;
};

axiosInstance.interceptors.request.use(
    (config) => {
        if (injectedStore) {
            const accessToken = injectedStore.getState().auth.accessToken; // Access token from Redux store
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`; // Attach token to Authorization header
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;
