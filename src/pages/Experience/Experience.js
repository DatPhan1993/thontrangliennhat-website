import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import styles from './Experience.module.scss';
import { Helmet } from 'react-helmet';
import { experiencesData } from '~/data/experiences';
import { categoriesData } from '~/data/categories';

const cx = classNames.bind(styles);

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groupedExperiences, setGroupedExperiences] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        try {
            // Use local data instead of API
            setCategories(categoriesData);
            
            // Group experiences by category
            const groupedExperiencesMap = {};
            
            categoriesData.forEach(category => {
                const experiencesByCategory = experiencesData.filter(experience => 
                    experience.categoryId === category.id
                );
                
                if (experiencesByCategory.length > 0) {
                    groupedExperiencesMap[category.id] = experiencesByCategory;
                }
            });
            
            setGroupedExperiences(groupedExperiencesMap);
            setExperiences(experiencesData);
            
            // Set the default active category to the first one with experiences
            const firstCategoryWithExperiences = categoriesData.find(
                cat => groupedExperiencesMap[cat.id] && groupedExperiencesMap[cat.id].length > 0
            );
            
            if (firstCategoryWithExperiences) {
                setActiveCategory(firstCategoryWithExperiences.id);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error processing experience data:', error);
            setLoading(false);
        }
    }, []);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleImageError = (e) => {
        console.log('Image error:', e.target.src);
        e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
    };

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Trải Nghiệm | HTX NÔNG NGHIỆP - DU LỊCH PHÚ NÔNG Liên Nhật </title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Du Lịch Phú Nông Liên Nhật hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp."
                />
                <meta
                    name="keywords"
                    content="trải nghiệm, du lịch nông nghiệp, hợp tác xã, phunongbuondon"
                />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            
            <div className={cx('experience-section')}>
                {/* Category Navigation */}
                <div className={cx('category-navigation')}>
                    <ul className={cx('category-list')}>
                        {categories.map((category) => {
                            // Only show categories that have experiences
                            if (!groupedExperiences[category.id] || groupedExperiences[category.id].length === 0) {
                                return null;
                            }
                            
                            return (
                                <li 
                                    key={category.id} 
                                    className={cx('category-item', { active: activeCategory === category.id })}
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <span className={cx('category-icon')}></span>
                                    {category.title}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                
                <div className={cx('experience-column')}>
                    {/* Display the active category title */}
                    {activeCategory && (
                        <h2 className={cx('experience-title')}>
                            {categories.find(cat => cat.id === activeCategory)?.title.toUpperCase()}
                        </h2>
                    )}
                    
                    {/* Display experiences for the active category */}
                    {activeCategory && groupedExperiences[activeCategory] && (
                        <div className={cx('experience-items-grid')}>
                            {groupedExperiences[activeCategory].map((item) => {
                                const categoryData = categories.find(cat => cat.id === item.categoryId);
                                
                                return (
                                    <div key={item.id} className={cx('experience-grid-item')}>
                                        <Link to={`${routes.experiences}/${categoryData?.slug}/${item.id}`}>
                                            <div className={cx('experience-item')}>
                                                <div className={cx('experience-image-container')}>
                                                    <img
                                                        src={item.images}
                                                        alt={item.title}
                                                        className={cx('experience-image')}
                                                        onError={handleImageError}
                                                    />
                                                </div>
                                                <h3 className={cx('experience-item-title')}>{item.title}</h3>
                                                <p className={cx('experience-summary')}>{item.summary}</p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default Experience;
