// Helper functions for sessionStorage
export const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

export const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Helper functions for localStorage
export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = (key) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Remove item from storage
export const removeFromStorage = (key, storageType = 'session') => {
    if (storageType === 'local') {
        localStorage.removeItem(key);
    } else {
        sessionStorage.removeItem(key);
    }
};

// Clear all items from storage
export const clearStorage = (storageType = 'session') => {
    if (storageType === 'local') {
        localStorage.clear();
    } else {
        sessionStorage.clear();
    }
}; 