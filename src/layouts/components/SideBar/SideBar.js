import React, { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { useBaseRoute } from '~/context/BaseRouteContext/BaseRouteContext';
import { Link, useLocation } from 'react-router-dom';
import { getCategoriesBySlug } from './services/categoryService/categoryService';

function SideBar({ categoryType }) {
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseRoute = useBaseRoute();
    const location = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        async function fetchCategoryData() {
            try {
                const data = await getCategoriesBySlug(categoryType);
                setCategoriesData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching category data:', error);
                setError(error);
                setLoading(false);
            }
        }

        fetchCategoryData();
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
        if (loading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: '100px',
                    }}
                >
                    <Spin size="small" />
                </div>
            );
        }

        if (error || !categoriesData) {
            return <div>Error loading data</div>;
        }

        return categoriesData.map((category) => {
            const isActive = location.pathname.includes(category.slug);

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
                                        to={`${baseRoute}/${subcategory.slug}`}
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
                    <Link to={`${baseRoute}/${category.slug}`} style={getTextStyle(isActive)}>
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
