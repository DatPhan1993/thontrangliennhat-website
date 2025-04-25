import httpRequest from '~/utils/httpRequest';
import { saveToSessionStorage, getFromSessionStorage } from '~/utils/storage';

// Get product by ID from API
export const getProductById = async (id) => {
    const sessionKey = `api_product_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/products/${id}`);
        const product = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, product);

        return product;
    } catch (error) {
        console.error(`Error fetching product detail with id ${id}:`, error);
        throw error;
    }
};

// Create a product (no sessionStorage needed for POST requests)
export const createProduct = async (productData) => {
    try {
        const response = await httpRequest.post('/products', productData);

        sessionStorage.removeItem('allProducts');

        return response.data.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Update a product and refresh sessionStorage for that product
export const updateProduct = async (id, productData) => {
    try {
        const response = await httpRequest.post(`/products/${id}`, productData);

        sessionStorage.removeItem('allProducts');
        sessionStorage.removeItem(`product_${id}`);

        return response.data.data;
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

// Delete a product and remove it from sessionStorage
export const deleteProduct = async (id) => {
    try {
        const response = await httpRequest.delete(`/products/${id}`);

        // Remove the deleted product from sessionStorage
        sessionStorage.removeItem(`product_${id}`);
        sessionStorage.removeItem('allProducts');

        return response.data.data;
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
}; 