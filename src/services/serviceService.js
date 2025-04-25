import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Get paginated services and cache the result
export const getServicePagination = async (page = 1, limit = 4) => {
    const sessionKey = `services_page_${page}_limit_${limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services?page=${page}&limit=${limit}`);
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error('Error fetching service', error);
        throw error;
    }
};

// Get all services and cache the result
export const getServices = async () => {
    const sessionKey = 'allServices';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/services');
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error('Error fetching service', error);
        throw error;
    }
};

// Get service by ID and cache the result
export const getServiceById = async (id) => {
    const sessionKey = `service_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services/${id}`);
        const serviceData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, serviceData);

        return serviceData;
    } catch (error) {
        console.error(`Error fetching service detail with id ${id}`, error);
        throw error;
    }
};

// Get services by category and cache the result
export const getServiceByCategory = async (categoryId) => {
    const sessionKey = `services_category_${categoryId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/services?child_nav_id=${categoryId}`);
        const servicesData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, servicesData);

        return servicesData;
    } catch (error) {
        console.error(`Error fetching service for id=${categoryId}:`, error);
        throw error;
    }
};

// Create service (no sessionStorage needed for POST requests)
export const createService = async (experienceData) => {
    try {
        const response = await httpRequest.post('services', experienceData);

        sessionStorage.removeItem(`allServices`);
        // Refresh sessionStorage for all experiences list
        const updatedServices = await getServices();
        saveToSessionStorage('allServices', updatedServices);

        return response.data.data;
    } catch (error) {
        console.error('Error adding experience', error);
        throw error;
    }
};

// Update service and refresh sessionStorage for that service item
export const updateService = async (id, serviceData) => {
    try {
        const response = await httpRequest.post(`/services/${id}`, serviceData);

        sessionStorage.removeItem(`service_${id}`);
        sessionStorage.removeItem(`allServices`);
        const updatedServices = await getServices();
        saveToSessionStorage('allServices', updatedServices);
        saveToSessionStorage(`service_${id}`, response.data.data);

        return response.data.data;
    } catch (error) {
        console.error(`Error updating service with id ${id}`, error);
        throw error;
    }
};

export const deleteService = async (id) => {
    try {
        await httpRequest.delete(`/services/${id}`);

        // Remove the deleted service from sessionStorage
        sessionStorage.removeItem(`service_${id}`);
        sessionStorage.removeItem(`allServices`);

        // Refresh sessionStorage for all services list
        const updatedServices = await getServices();
        saveToSessionStorage('allServices', updatedServices);
    } catch (error) {
        console.error(`Error deleting service with id ${id}`, error);
        throw error;
    }
};
