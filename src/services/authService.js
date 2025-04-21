import httpRequest from '~/utils/httpRequest';

export const login = async (username, password) => {
    try {
        const response = await httpRequest.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await httpRequest.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const checkAuth = async () => {
    try {
        const response = await httpRequest.get('/auth/check');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const response = await httpRequest.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        throw error;
    }
}; 