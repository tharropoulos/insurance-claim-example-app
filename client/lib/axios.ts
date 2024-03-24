import axios from "axios";

const axiosInstance = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/"
            : "https://claims-api.fly.dev/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
