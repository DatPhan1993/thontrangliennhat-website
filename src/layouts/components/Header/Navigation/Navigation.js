import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Link, NavLink } from 'react-router-dom';
import { navigationData } from '~/data/navigation';
import styles from './Navigation.module.scss';
import Search from '../../Search/Seach';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faChevronRight,
    faChevronDown,
    faSearch,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Navigation({ isFixed }) {
    const [navigationLinks] = useState(navigationData);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [openSubSubMenus, setOpenSubSubMenus] = useState({});
    const [showSearch, setShowSearch] = useState(false);

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

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <div className={cx('wrapper', { fixed: isFixed })}>
            <div className={cx('inner')}>
                <div className={cx('nav-left-section')}>
                    <div className={cx('mobile-menu-icon')} onClick={toggleMenu}>
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                    </div>
                    <Link to="/" className={cx('logo-link')}>
                        <img src={images.logo} alt="Logo" className={cx('logo')} />
                    </Link>
                    <div className={cx('company-name')}>
                        <Link to="/">THÔN TRANG LIÊN NHẬT</Link>
                    </div>
                </div>
                
                <nav className={cx('main-nav')}>
                    <ul className={cx('navigation-links', { open: isMenuOpen })}>
                        {navigationLinks.map((link) => {
                            const sortedChilds = (link.children || []).sort((a, b) => a.position - b.position);
                            return (
                                <li
                                    key={link.id}
                                    className={cx({ 'has-children': sortedChilds.length > 0 })}
                                    onMouseEnter={() => handleMouseEnter(link.id)}
                                    onMouseLeave={() => handleMouseLeave(link.id)}
                                    onClick={() => toggleSubMenu(link.id)}
                                >
                                    <div className={cx('menu-item')}>
                                        <NavLink
                                            to={`/${link.slug}`}
                                            className={cx('nav-link')}
                                            onClick={handleLinkClick}
                                        >
                                            {link.title.toUpperCase()}
                                        </NavLink>
                                        {sortedChilds.length > 0 && (
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
                                                            toggleSubSubMenu(link.id, childLink.id);
                                                        }}
                                                    >
                                                        <div className={cx('sub-link-wrapper')}>
                                                            <NavLink
                                                                to={`/${link.slug}/${childLink.slug}`}
                                                                className={cx('sub-link')}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLinkClick();
                                                                }}
                                                            >
                                                                {childLink.title}
                                                            </NavLink>
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
                                                                            <NavLink
                                                                                to={`/${link.slug}/${childLink.slug}/${subChildLink.slug}`}
                                                                                className={cx('sub-sub-link')}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation(); 
                                                                                    handleLinkClick();
                                                                                }}
                                                                            >
                                                                                {subChildLink.title}
                                                                            </NavLink>
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
                </nav>
                <div className={cx('search-icon')} onClick={toggleSearch}>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
                {showSearch && <Search onClose={toggleSearch} />}
            </div>
        </div>
    );
}

export default Navigation;
