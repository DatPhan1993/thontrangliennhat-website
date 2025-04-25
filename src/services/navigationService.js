import httpRequest from '~/utils/httpRequest';
import { saveToSessionStorage, getFromSessionStorage } from '~/utils/storage';
import { navigationData } from '~/data/navigation';

// Fallback data cho navigation khi có lỗi
const fallbackNavigation = [
    {
        id: 1,
        title: 'Giới thiệu',
        slug: 'gioi-thieu',
        position: 1,
        children: []
    },
    {
        id: 2,
        title: 'Sản phẩm',
        slug: 'san-pham',
        position: 2,
        children: []
    },
    {
        id: 3,
        title: 'Dịch vụ',
        slug: 'dich-vu',
        position: 3,
        children: []
    },
    {
        id: 4,
        title: 'Trải nghiệm',
        slug: 'trai-nghiem',
        position: 4,
        children: []
    },
    {
        id: 5,
        title: 'Tin tức',
        slug: 'tin-tuc',
        position: 5,
        children: []
    },
    {
        id: 6,
        title: 'Liên hệ',
        slug: 'lien-he',
        position: 6,
        children: []
    }
];

// Navigation Links
export const getNavigationLinks = async () => {
    const sessionKey = 'navigationLinks';

    try {
        // Đầu tiên thử lấy từ sessionStorage
        const cachedData = getFromSessionStorage(sessionKey);
        if (cachedData) {
            return cachedData;
        }
        
        // Nếu không có trong cache, gửi request API
        const response = await httpRequest.get('/parent-navs/all-with-child');
        const navigationLinks = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationLinks);

        return navigationLinks;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        
        // Kiểm tra xem có phải lỗi mạng/SSL không
        if (!error.response || error.message.includes('SSL') || 
            error.code === 'ERR_SSL_PROTOCOL_ERROR' || 
            error.code === 'CERT_HAS_EXPIRED') {
            
            console.log('Using fallback navigation data');
            // Trả về dữ liệu mặc định khi có lỗi
            return fallbackNavigation;
        }
        
        throw error;
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
        // Thay vì gọi API, sử dụng dữ liệu tĩnh
        const navigationLinks = navigationData.map(item => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            position: item.position
        }));

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
        // Thay vì gọi API, sử dụng dữ liệu tĩnh
        let allChildren = [];
        
        navigationData.forEach(parent => {
            allChildren = [...allChildren, ...parent.children.map(child => ({
                ...child,
                parentId: parent.id
            }))];
        });

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, allChildren);

        return allChildren;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        throw error;
    }
};

// Navigation Links with all children
export const getAllWithChildNavigation = async () => {
    const sessionKey = 'AllWithChildNavigation';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Thay vì gọi API, sử dụng dữ liệu tĩnh
        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navigationData);

        return navigationData;
    } catch (error) {
        console.error('Error fetching navigation links:', error);
        throw error;
    }
};

export const getNavigationById = async (id) => {
    const sessionKey = `navigation_${id}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Tìm kiếm trong dữ liệu tĩnh
        let navItem = null;
        
        // Tìm trong danh sách chính
        const parentNav = navigationData.find(item => item.id === parseInt(id));
        if (parentNav) {
            navItem = parentNav;
        } else {
            // Tìm trong danh sách con
            for (const parent of navigationData) {
                const childNav = parent.children.find(child => child.id === parseInt(id));
                if (childNav) {
                    navItem = childNav;
                    break;
                }
            }
        }

        if (!navItem) {
            throw new Error(`Navigation with id ${id} not found`);
        }

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, navItem);

        return navItem;
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

// Thêm phương thức để xóa cache navigation khi cần thiết
export const clearNavigationCache = () => {
    try {
        sessionStorage.removeItem('navigationLinks');
        sessionStorage.removeItem('MainNavigation');
        sessionStorage.removeItem('SubNavigation');
        sessionStorage.removeItem('ChildNavigation');
        console.log('Navigation cache cleared');
    } catch (error) {
        console.error('Error clearing navigation cache:', error);
    }
};
