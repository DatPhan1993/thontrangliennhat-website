import React from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from './Services.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import { servicesData } from '~/data/services';
import { categoriesData } from '~/data/categories';

const cx = classNames.bind(styles);

function Services() {
    // Lấy các dịch vụ nổi bật (featured) từ dữ liệu local
    const featuredServices = servicesData
        .filter(service => service.isFeatured)
        .slice(0, 6); // Lấy tối đa 6 dịch vụ để hiển thị

    // Hàm lấy slug danh mục từ categoryId
    const getCategorySlug = (categoryId) => {
        const category = categoriesData.find(cat => cat.id === categoryId);
        return category ? category.slug : '';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="DỊCH VỤ DU LỊCH" showSeeAll={true} slug={`${routes.services}`} />
                <div className={cx('service-slider-container')}>
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
                        {featuredServices.map((service) => (
                            <SwiperSlide key={service.id}>
                                <div className={cx('service-item')}>
                                    <Link 
                                        to={`${routes.services}/${getCategorySlug(service.categoryId)}/${service.id}`} 
                                        className={cx('service-link')}
                                    >
                                        <div className={cx('service-image-container')}>
                                            <img 
                                                src={service.images} 
                                                alt={service.name} 
                                                className={cx('service-image')} 
                                                onError={(e) => {
                                                    console.log('Image error:', e.target.src);
                                                    e.target.src = '/images/products/tomcangxanh.jpg';
                                                }}
                                            />
                                        </div>
                                        <h3 className={cx('service-name')}>{service.name}</h3>
                                        <div className={cx('service-detail-btn')}>
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

export default Services;
