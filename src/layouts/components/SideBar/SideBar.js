import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { useBaseRoute } from '~/context/BaseRouteContext';
import { Link, useLocation } from 'react-router-dom';
import { categoriesData } from '~/data/categories';
import routes from '~/config/routes';

function SideBar({ categoryType }) {
    const [categoriesFiltered, setCategoriesFiltered] = useState([]);
    const baseRoute = useBaseRoute();
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        // Filter categories based on categoryType if needed
        setCategoriesFiltered(categoriesData);
    }, [categoryType]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getIconStyle = (active) => ({
        marginRight: 8,
        color: active ? '#ec7324' : '#2d2e8a',
    });

    const getTextStyle = (active) => ({
        fontWeight: 600,
        color: active ? '#0866ff' : 'inherit',
    });

    const renderMenuItems = () => {
        if (!categoriesFiltered || categoriesFiltered.length === 0) {
            return null;
        }

        return categoriesFiltered.map((category) => {
            const isActive = location.pathname.includes(category.slug);
            
            // Determine the correct link prefix based on category type
            let linkPrefix;
            if (categoryType === 'dich-vu') {
                linkPrefix = routes.services;
            } else if (categoryType === 'trai-nghiem') {
                linkPrefix = routes.experiences;
            } else {
                linkPrefix = baseRoute;
            }

            if (category.children && category.children.length > 0) {
                return (
                    <Menu.SubMenu
                        key={category.id}
                        title={
                            <span style={getTextStyle(isActive)}>
                                <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(isActive)} />
                                {category.title}
                            </span>
                        }
                    >
                        {category.children.map((subcategory) => {
                            const subcategoryActive = location.pathname.includes(subcategory.slug);

                            return (
                                <Menu.Item key={subcategory.id}>
                                    <Link
                                        to={`${linkPrefix}/${subcategory.slug}`}
                                        style={getTextStyle(subcategoryActive)}
                                    >
                                        <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(subcategoryActive)} />
                                        {subcategory.title}
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                    </Menu.SubMenu>
                );
            }

            return (
                <Menu.Item key={category.id}>
                    <Link to={`${linkPrefix}/${category.slug}`} style={getTextStyle(isActive)}>
                        <FontAwesomeIcon icon={faCircleDot} style={getIconStyle(isActive)} />
                        {category.title}
                    </Link>
                </Menu.Item>
            );
        });
    };

    return (
        <aside style={{ width: windowWidth < 1280 ? 0 : '100%', height: '100%', transition: 'width 0.3s ease' }}>
            {windowWidth >= 1280 && (
                <Menu mode="inline" theme="light" style={{ border: 0 }}>
                    {renderMenuItems()}
                </Menu>
            )}
        </aside>
    );
}

export default SideBar;
