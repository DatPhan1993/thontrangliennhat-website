import { saveToSessionStorage, getFromSessionStorage } from '~/utils/storage';
import { productsData } from '~/data/products';

// Get all products and cache them in sessionStorage
export const getProducts = async () => {
    const sessionKey = 'allProducts';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        const products = productsData;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get products with pagination and cache them in sessionStorage
export const getProductsPagination = async ($page = 1, $limit = 8) => {
    const sessionKey = `products_page_${$page}_limit_${$limit}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        const startIndex = ($page - 1) * $limit;
        const endIndex = startIndex + $limit;
        const products = productsData.slice(startIndex, endIndex);

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get product by ID and cache the result
export const getProductById = async (id) => {
    const sessionKey = `product_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        const product = productsData.find(p => p.id === parseInt(id));
        
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, product);

        return product;
    } catch (error) {
        console.error(`Error fetching product detail with id ${id}:`, error);
        throw error;
    }
};

// Get products by category and cache them
export const getProductsByCategory = async (categoryId) => {
    const sessionKey = `products_category_${categoryId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        const products = productsData.filter(p => p.categoryId === parseInt(categoryId));

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, products);

        return products;
    } catch (error) {
        console.error(`Error fetching products for category id=${categoryId}:`, error);
        throw error;
    }
};

// Get product by slug and cache the result
export const getProductBySlug = async (slug) => {
    const sessionKey = `product_slug_${slug}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        const product = productsData.find(p => p.slug === slug);
        
        if (!product) {
            throw new Error(`Product with slug ${slug} not found`);
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, product);

        return product;
    } catch (error) {
        console.error(`Error fetching product detail with slug ${slug}:`, error);
        throw error;
    }
};
