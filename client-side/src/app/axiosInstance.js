import axios from "axios";

const BASEURL = "http://localhost:3500/"

const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosInstance;