import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});
api.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem('access');
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refresh");
                const response = await axios.post('http://localhost:8000/api/token/refresh/', {refreshToken});
                const { access } = response.data;
                localStorage.setItem('access', access);
                console.log("Token refresh success. New access token:", access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (err) {
                console.error(err);
            }
        } 
        return Promise.reject(error);
    }
);
export default api;