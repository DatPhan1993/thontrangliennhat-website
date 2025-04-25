import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import styles from './Experiences.module.scss';
import images from '~/assets/images';
import { experiencesData } from '~/data/experiences';
import { categoriesData } from '~/data/categories';

const cx = classNames.bind(styles);

function Experiences() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        setExperiences(experiencesData);
        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    const handleImageError = (e) => {
        e.target.src = images.placeholder;
    };
    
    // Helper function to get category slug by category ID
    const getCategorySlug = (categoryId) => {
        const category = categoriesData.find(cat => cat.id === categoryId);
        return category ? category.slug : 'default-category';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="KHU VỰC TRẢI NGHIỆM" showSeeAll={true} slug={`${routes.experiences}`} />
                <div className={cx('experience-slider-container')}>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        modules={[Autoplay, Navigation, Pagination]}
                        navigation={{
                            nextEl: `.${cx('swiper-button-next')}`,
                            prevEl: `.${cx('swiper-button-prev')}`,
                        }}
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        className={cx('swiper')}
                        breakpoints={{
                            // Khi chiều rộng < 768px (mobile)
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            // Khi chiều rộng >= 768px và < 992px (tablet)
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 15,
                            },
                            // Khi chiều rộng >= 992px (desktop)
                            992: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {experiences.map((experience) => (
                            <SwiperSlide key={experience.id}>
                                <div className={cx('experience-item')}>
                                    <Link 
                                        to={`${routes.experiences}/${getCategorySlug(experience.categoryId)}/${experience.id}`} 
                                        className={cx('experience-link')}
                                    >
                                        <div className={cx('experience-image-container')}>
                                            <img 
                                                src={experience.images} 
                                                alt={experience.title} 
                                                className={cx('experience-image')}
                                                onError={handleImageError}
                                            />
                                        </div>
                                        <h3 className={cx('experience-title')}>{experience.title}</h3>
                                        <p className={cx('experience-summary')}>{experience.summary}</p>
                                        <div className={cx('experience-detail-btn')}>
                                            <span>Xem chi tiết</span>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={cx('swiper-button-prev')}>
                        <FontAwesomeIcon icon={faChevronLeft} className={cx('swiper-icon')} />
                    </div>
                    <div className={cx('swiper-button-next')}>
                        <FontAwesomeIcon icon={faChevronRight} className={cx('swiper-icon')} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Experiences;
