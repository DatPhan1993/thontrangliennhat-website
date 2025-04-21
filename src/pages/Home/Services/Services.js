import React from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Services.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import serviceImages from '~/assets/images/services';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const cx = classNames.bind(styles);

function Services() {
    // API base URL for images
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.thontrangliennhat.com';
    
    // Tạo danh sách 7 dịch vụ trống với hình ảnh từ assets
    const emptyServices = [
        {
            id: 'service-1',
            slug: 'service-1',
            images: serviceImages.service1,
            apiImage: `${API_BASE_URL}/images/services/service1.jpg`
        },
        {
            id: 'service-2',
            slug: 'service-2',
            images: serviceImages.service2,
            apiImage: `${API_BASE_URL}/images/services/service2.jpg`
        },
        {
            id: 'service-3',
            slug: 'service-3',
            images: serviceImages.service3,
            apiImage: `${API_BASE_URL}/images/services/service3.jpg`
        },
        {
            id: 'service-4',
            slug: 'service-4',
            images: serviceImages.service4,
            apiImage: `${API_BASE_URL}/images/services/service4.jpg`
        },
        {
            id: 'service-5',
            slug: 'service-5',
            images: serviceImages.service5,
            apiImage: `${API_BASE_URL}/images/services/service5.jpg`
        },
        {
            id: 'service-6',
            slug: 'service-6',
            images: serviceImages.service6,
            apiImage: `${API_BASE_URL}/images/services/service6.jpg`
        },
        {
            id: 'service-7',
            slug: 'service-7',
            images: serviceImages.service7,
            apiImage: `${API_BASE_URL}/images/services/service7.jpg`
        }
    ];

    // Function to handle image click
    const handleImageClick = (apiImage, fallbackImage) => {
        // Open image in new tab
        window.open(apiImage || fallbackImage, '_blank');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="DỊCH VỤ DU LỊCH" showSeeAll={true} slug={`${routes.services}`} />
                <div className={cx('slider-container')}>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        modules={[Navigation, Autoplay]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            1024: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                            0: { slidesPerView: 1 },
                        }}
                        className={cx('swiper')}
                    >
                        {emptyServices.map((service) => (
                            <SwiperSlide key={service.id} className={cx('swiper-slide')}>
                                <div className={cx('service-item')}>
                                    <div 
                                        className={cx('service-image-container')}
                                        onClick={() => handleImageClick(service.apiImage, service.images)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img 
                                            src={service.images} 
                                            alt="Dịch vụ du lịch" 
                                            className={cx('service-image')} 
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default Services;
