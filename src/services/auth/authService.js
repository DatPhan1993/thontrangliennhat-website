import httpRequest from '../../utils/httpRequest';

export const login = async (credentials) => {
    try {
        const response = await httpRequest.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await httpRequest.post('/auth/logout');
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async (id) => {
    try {
        const response = await httpRequest.get(`/account/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await httpRequest.post('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
