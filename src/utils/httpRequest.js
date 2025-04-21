import axios from 'axios';

// Xác định BASE_URL để đảm bảo luôn dùng HTTPS
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://api.thontrangliennhat.com';

// Đảm bảo URL sử dụng HTTPS
const getSecureUrl = (url) => {
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    return url;
};

// Tạo axios instance
const httpRequest = axios.create({
    baseURL: getSecureUrl(BASE_URL),
    timeout: 10000, // 10s timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
httpRequest.interceptors.request.use(
    (config) => {
        // Thêm token nếu có
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // Đảm bảo URL sử dụng HTTPS
        if (config.url && config.url.startsWith('http://')) {
            config.url = config.url.replace('http://', 'https://');
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
httpRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi phản hồi
        console.error('Response error:', error?.response?.status, error?.message);
        // Kiểm tra nếu là lỗi 401 - Unauthorized
        if (error?.response?.status === 401) {
            // Có thể xử lý logout hoặc refresh token tại đây
            localStorage.removeItem('accessToken');
        }
        return Promise.reject(error);
    }
);

// Helper functions
export const get = async (path, options = {}) => {
    try {
        const response = await httpRequest.get(path, options);
        return response.data;
    } catch (error) {
        console.error(`GET error for ${path}:`, error?.message);
        throw error;
    }
};

export const post = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.post(path, data, options);
        return response.data;
    } catch (error) {
        console.error(`POST error for ${path}:`, error?.message);
        throw error;
    }
};

export const put = async (path, data, options = {}) => {
    try {
        const response = await httpRequest.put(path, data, options);
        return response.data;
    } catch (error) {
        console.error(`PUT error for ${path}:`, error?.message);
        throw error;
    }
};

export const del = async (path, options = {}) => {
    try {
        const response = await httpRequest.delete(path, options);
        return response.data;
    } catch (error) {
        console.error(`DELETE error for ${path}:`, error?.message);
        throw error;
    }
};

export default httpRequest;
