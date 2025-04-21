import httpRequest from '~/utils/httpRequest';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
};

const getFromSessionStorage = (key) => {
    try {
        const storedData = sessionStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error('Error parsing from sessionStorage:', error);
        return null;
    }
};

// Navigation Links
export const getNavigationLinks = async () => {
    const sessionKey = 'navigationLinks';

    try {
        const cachedData = getFromSessionStorage(sessionKey);
        if (cachedData) {
            return cachedData;
        }

        // Đầu tiên thử lấy dữ liệu từ API
        const response = await httpRequest.get('/api/parent-navs/all-with-child');
        
        // Kiểm tra response có tồn tại và có thuộc tính data
        if (!response || !response.data) {
            throw new Error('Invalid API response');
        }

        // Kiểm tra xem response.data có phải là mảng không
        let navigationLinks = [];
        if (Array.isArray(response.data)) {
            navigationLinks = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
            navigationLinks = response.data.data;
        } else {
            throw new Error('Navigation data is not in expected format');
        }

        // Đảm bảo tất cả các phần tử đều có mảng children và thuộc tính position
        const processedLinks = navigationLinks.map((link, index) => ({
            ...link,
            children: Array.isArray(link.children) ? link.children : [],
            position: link.position || (index + 1)
        }));

        // Sắp xếp dựa trên position
        const sortedLinks = processedLinks.sort((a, b) => a.position - b.position);
        
        // Save to sessionStorage
        saveToSessionStorage(sessionKey, sortedLinks);

        return sortedLinks;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        // Dữ liệu fallback trong trường hợp API gặp lỗi
        const fallbackLinks = [
            {
                id: 1,
                title: 'TRANG CHỦ',
                slug: '/',
                position: 1,
                children: []
            },
            {
                id: 2,
                title: 'GIỚI THIỆU',
                slug: '/gioi-thieu',
                position: 2,
                children: []
            },
            {
                id: 3,
                title: 'SẢN PHẨM',
                slug: '/san-pham',
                position: 3,
                children: []
            },
            {
                id: 4,
                title: 'DỊCH VỤ',
                slug: '/dich-vu',
                position: 4,
                children: []
            },
            {
                id: 5,
                title: 'TRẢI NGHIỆM',
                slug: '/trai-nghiem',
                position: 5,
                children: []
            },
            {
                id: 6,
                title: 'TIN TỨC',
                slug: '/tin-tuc',
                position: 6,
                children: []
            },
            {
                id: 7,
                title: 'LIÊN HỆ',
                slug: '/lien-he',
                position: 7,
                children: []
            }
        ];
        
        // Save fallback data to sessionStorage
        saveToSessionStorage(sessionKey, fallbackLinks);
        
        return fallbackLinks;
    }
};

// Navigation Links
export const getMainNavigation = async () => {
    const sessionKey = 'MainNavigation';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/parent-navs');
        const navigationLinks = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLinks);

        return navigationLinks;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        throw error;
    }
};

// Navigation Links
export const getSubNavigation = async () => {
    const sessionKey = 'SubNavigation';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/child-navs');
        const navigationLinks = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLinks);

        return navigationLinks;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        throw error;
    }
};

// Navigation Links
export const getChildNavigation = async () => {
    const sessionKey = 'ChildNavigation';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get('/child-navs-two');
        const navigationLinks = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLinks);

        return navigationLinks;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        throw error;
    }
};

export const getNavigationById = async (id) => {
    const sessionKey = `child_nav_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/child-navs/${id}`);
        const navigationLink = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLink);

        return navigationLink;
    } catch (error) {
        console.error('Error fetching navigation link:', error);
        throw error;
    }
};

export const getMainNavigationById = async (id) => {
    const sessionKey = `parent_nav_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/parent-navs/${id}`);
        const navigationLink = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLink);

        return navigationLink;
    } catch (error) {
        console.error('Error fetching navigation link:', error);
        throw error;
    }
};

export const getSubNavigationById = async (id) => {
    const sessionKey = `child_nav_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/child-navs/${id}`);
        const navigationLink = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLink);

        return navigationLink;
    } catch (error) {
        console.error('Error fetching navigation link:', error);
        throw error;
    }
};

export const getChildNavigationById = async (id) => {
    const sessionKey = `child_nav_two_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/child-navs-two/${id}`);
        const navigationLink = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLink);

        return navigationLink;
    } catch (error) {
        console.error('Error fetching navigation link:', error);
        throw error;
    }
};

export const createMainNavigationLink = async (data) => {
    try {
        const response = await httpRequest.post('/parent-navs', data);

        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error creating navigation link:', error);
        throw error;
    }
};

export const createSubNavigationLink = async (data) => {
    try {
        const response = await httpRequest.post('/child-navs', data);

        // Refresh sessionStorage for navigation links
        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error creating navigation link:', error);
        throw error;
    }
};

export const createChildNavigationLink = async (data) => {
    try {
        const response = await httpRequest.post('/child-navs-two', data);

        // Refresh sessionStorage for navigation links
        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error creating navigation link:', error);
        throw error;
    }
};

export const updateMainNavigationLink = async (id, data) => {
    try {
        const response = await httpRequest.patch(`/parent-navs/${id}`, data);

        sessionStorage.removeItem(`parent_nav_${id}`);
        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error updating navigation link:', error);
        throw error;
    }
};

export const updateSubNavigationLink = async (id, data) => {
    try {
        const response = await httpRequest.patch(`/child-navs/${id}`, data);

        sessionStorage.removeItem(`child_nav_${id}`);
        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error updating navigation link:', error);
        throw error;
    }
};

export const updateChildNavigationLink = async (id, data) => {
    try {
        const response = await httpRequest.patch(`/child-navs-two/${id}`, data);

        sessionStorage.removeItem(`child_nav_two_${id}`);
        sessionStorage.removeItem('navigationLinks');
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);

        return response.data.data;
    } catch (error) {
        console.error('Error updating navigation link:', error);
        throw error;
    }
};

export const deleteMainNavigationLink = async (type, id) => {
    const data = { type, id };
    console.log(data);
    try {
        await httpRequest.delete(`/parent-navs/${id}`, { data });

        // Remove the deleted navigation link from sessionStorage and refresh links
        sessionStorage.removeItem(`parent_nav_${id}`);
        sessionStorage.removeItem(`navigationLinks`);

        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);
    } catch (error) {
        console.error('Error deleting navigation link:', error);
        throw error;
    }
};

export const deleteSubNavigationLink = async (type, id) => {
    const data = { type, id };
    console.log(data);
    try {
        await httpRequest.delete(`/child-navs/${id}`, { data });

        // Remove the deleted navigation link from sessionStorage and refresh links
        sessionStorage.removeItem(`child_navs_${id}`);
        sessionStorage.removeItem(`navigationLinks`);

        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);
    } catch (error) {
        console.error('Error deleting navigation link:', error);
        throw error;
    }
};

export const deleteChildNavigationLink = async (type, id) => {
    const data = { type, id };
    console.log(data);
    try {
        await httpRequest.delete(`/child-navs-two/${id}`, { data });

        // Remove the deleted navigation link from sessionStorage and refresh links
        sessionStorage.removeItem(`child_nav_two_${id}`);
        sessionStorage.removeItem(`navigationLinks`);
        const updatedNavigationLinks = await getNavigationLinks();
        saveToSessionStorage('navigationLinks', updatedNavigationLinks);
    } catch (error) {
        console.error('Error deleting navigation link:', error);
        throw error;
    }
};
