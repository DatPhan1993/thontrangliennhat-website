import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from './Products.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { productsData } from '~/data/products';

const cx = classNames.bind(styles);

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sử dụng dữ liệu tĩnh thay vì gọi API
        setProducts(productsData);
        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="SẢN PHẨM" showSeeAll={true} slug={`${routes.products}`} />
                <div className={cx('product-slider-container')}>
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
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className={cx('product-item')}>
                                    <Link to={`/san-pham`} className={cx('product-link')}>
                                        <div className={cx('product-image-container')}>
                                            <img 
                                                src={product.images} 
                                                alt={product.name} 
                                                className={cx('product-image')}
                                                onError={(e) => {
                                                    console.log('Image error:', e.target.src);
                                                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
                                                }}
                                            />
                                        </div>
                                        <h3 className={cx('product-name')}>{product.name}</h3>
                                        <div className={cx('product-detail-btn')}>
                                            <span>Xem thực đơn</span>
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

export default Products;
