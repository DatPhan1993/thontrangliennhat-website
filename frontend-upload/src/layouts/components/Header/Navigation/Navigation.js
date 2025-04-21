import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, NavLink } from 'react-router-dom';
import { getNavigationLinks } from '~/services/navigationService';
import styles from './Navigation.module.scss';
import Search from '~/layouts/components/Search/Search';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faChevronRight,
    faChevronDown,
    // faHome,
    // faInfoCircle,
    // faBox,
    // faLayerGroup,
    // faProjectDiagram,
    // faNewspaper,
    // faUsers,
    // faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/images';
// Import danh sách sản phẩm và tin tức cho dropdown
import { productDropdownItems, newsDropdownItems } from '~/constants/navigationData';

// const iconsData = [
//     { position: 1, icon: faInfoCircle },
//     { position: 2, icon: faBox },
//     { position: 3, icon: faLayerGroup },
//     { position: 4, icon: faProjectDiagram },
//     { position: 5, icon: faNewspaper },
//     { position: 6, icon: faUsers },
//     { position: 7, icon: faEnvelope },
// ];

const cx = classNames.bind(styles);

function Navigation({ isFixed }) {
    const [navigationLinks, setNavigationLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [openSubSubMenus, setOpenSubSubMenus] = useState({});

    useEffect(() => {
        const fetchNavigationLinks = async () => {
            try {
                const links = await getNavigationLinks();
                const sortedLinks = links.sort((a, b) => a.position - b.position);
                
                // Tìm menu SẢN PHẨM và TIN TỨC, cập nhật submenu với danh sách mới
                const updatedLinks = sortedLinks.map(link => {
                    // Kiểm tra xem link hiện tại có phải là SẢN PHẨM không
                    if (link.title === 'SẢN PHẨM' || link.slug === 'san-pham') {
                        return {
                            ...link,
                            children: productDropdownItems
                        };
                    }
                    // Kiểm tra xem link hiện tại có phải là TIN TỨC không
                    else if (link.title === 'TIN TỨC' || link.slug === 'tin-tuc') {
                        return {
                            ...link,
                            children: newsDropdownItems
                        };
                    }
                    return link;
                });

                setNavigationLinks(updatedLinks);
            } catch (error) {
                setError(error);
                console.error('Error fetching navigation links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNavigationLinks();
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    };

    const toggleSubMenu = (id, fromChild = false) => {
        if (!fromChild) {
            setOpenSubMenus((prevState) => ({
                ...prevState,
                [id]: !prevState[id],
            }));
        }
    };

    const toggleSubSubMenu = (parentId, childId) => {
        setOpenSubSubMenus((prevState) => ({
            ...prevState,
            [`${parentId}-${childId}`]: !prevState[`${parentId}-${childId}`],
        }));
    };

    const handleMouseEnter = (id) => {
        if (window.innerWidth >= 1280) {
            setOpenSubMenus((prevState) => ({
                ...prevState,
                [id]: true,
            }));
        }
    };

    const handleMouseLeave = (id) => {
        if (window.innerWidth >= 1280) {
            setOpenSubMenus((prevState) => ({
                ...prevState,
                [id]: false,
            }));
        }
    };

    const handleMouseEnterChild = (parentId, childId) => {
        if (window.innerWidth >= 1280) {
            setOpenSubSubMenus((prevState) => ({
                ...prevState,
                [`${parentId}-${childId}`]: true,
            }));
        }
    };

    const handleMouseLeaveChild = (parentId, childId) => {
        if (window.innerWidth >= 1280) {
            setOpenSubSubMenus((prevState) => ({
                ...prevState,
                [`${parentId}-${childId}`]: false,
            }));
        }
    };
    
    // Hàm mở link trong tab mới
    const openExternalLink = (url) => {
        window.open(url, '_blank');
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className={cx('wrapper', { fixed: isFixed })}>
            <div className={cx('inner')}>
                <div className={cx('mobile-menu-icon')} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                </div>
                <Link to="/" className={cx('logo-container')}>
                    <img src={images.logo} alt="Logo" className={cx('logo')} />
                    <div className={cx('company-name')}>
                        <span>HTX SẢN XUẤT NÔNG NGHIỆP VÀ</span>
                        <span>DỊCH VỤ TỔNG HỢP LIÊN NHẬT</span>
                    </div>
                </Link>
                <ul className={cx('navigation-links', { open: isMenuOpen })}>
                    {navigationLinks.map((link) => {
                        // const iconData = iconsData.find((icon) => icon.position === link.position);
                        const sortedChilds = link.children.sort((a, b) => a.position - b.position);
                        return (
                            <li
                                key={link.id}
                                className={cx({ 'has-children': link.children.length > 0 })}
                                onMouseEnter={() => handleMouseEnter(link.id)} // Hover event
                                onMouseLeave={() => handleMouseLeave(link.id)} // Leave event
                                onClick={() => toggleSubMenu(link.id)} // Click event for mobile
                            >
                                <div className={cx('menu-item')}>
                                    <NavLink
                                        end
                                        to={`/${link.slug}`}
                                        className={({ isActive }) => cx({ 'active-link': isActive })}
                                        onClick={handleLinkClick}
                                    >
                                        <div className={cx('item-icon')}>
                                            {/* {iconData && (
                                                <FontAwesomeIcon icon={iconData.icon} className={cx('nav-icon')} />
                                            )} */}
                                            {link.title}
                                        </div>
                                    </NavLink>
                                    {link.children.length > 0 && (
                                        <FontAwesomeIcon
                                            icon={openSubMenus[link.id] ? faChevronDown : faChevronRight}
                                            className={cx('submenu-icon')}
                                        />
                                    )}
                                </div>
                                {sortedChilds.length > 0 && (
                                    <ul className={cx('dropdown', { open: openSubMenus[link.id] })}>
                                        {sortedChilds.map((childLink) => {
                                            const sortedSubChilds = (childLink.children || []).sort(
                                                (a, b) => a.position - b.position,
                                            );
                                            
                                            // Kiểm tra xem childLink có externalUrl không
                                            const hasExternalLink = childLink.externalUrl;
                                            
                                            return (
                                                <li
                                                    key={childLink.id}
                                                    className={cx({
                                                        'has-sub-children': sortedSubChilds.length > 0,
                                                    })}
                                                    onMouseEnter={() => handleMouseEnterChild(link.id, childLink.id)}
                                                    onMouseLeave={() => handleMouseLeaveChild(link.id, childLink.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (hasExternalLink) {
                                                            openExternalLink(childLink.externalUrl);
                                                        } else {
                                                            toggleSubSubMenu(link.id, childLink.id);
                                                        }
                                                    }}
                                                >
                                                    <div className={cx('sub-link-wrapper')}>
                                                        <div 
                                                            className={cx('dropdown-item', { 'external-link': hasExternalLink })}
                                                        >
                                                            {childLink.title}
                                                        </div>
                                                        {sortedSubChilds.length > 0 && (
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    openSubSubMenus[`${link.id}-${childLink.id}`]
                                                                        ? faChevronDown
                                                                        : faChevronRight
                                                                }
                                                                className={cx('submenu-icon')}
                                                            />
                                                        )}
                                                    </div>
                                                    {sortedSubChilds.length > 0 && (
                                                        <ul
                                                            className={cx('dropdown-second-level', {
                                                                open: openSubSubMenus[`${link.id}-${childLink.id}`],
                                                            })}
                                                        >
                                                            {sortedSubChilds.map((subChildLink) => {
                                                                return (
                                                                    <li key={subChildLink.id}>
                                                                        <div className={cx('dropdown-item')}>
                                                                            {subChildLink.title}
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <Search />
            </div>
        </div>
    );
}

export default Navigation;
