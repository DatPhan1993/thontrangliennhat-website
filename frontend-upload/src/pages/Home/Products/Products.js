import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Products.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import hình ảnh từ assets
import productImages from '~/assets/images/products';

const cx = classNames.bind(styles);

function Products() {
    // Danh sách sản phẩm mới theo yêu cầu
    const [products] = useState([
        {
            id: 'product-1',
            name: 'Mẹt các loại',
            slug: 'met-cac-loai',
            images: productImages.metCacLoai,
            summary: 'Mẹt các loại đa dạng món ăn từ HTX'
        },
        {
            id: 'product-2',
            name: 'Tôm sú',
            slug: 'tom-su',
            images: productImages.tomSu,
            summary: 'Tôm sú tươi sống từ HTX'
        },
        {
            id: 'product-3',
            name: 'Tôm càng xanh',
            slug: 'tom-cang-xanh',
            images: productImages.tomCangXanh,
            summary: 'Tôm càng xanh tươi ngon'
        },
        {
            id: 'product-4',
            name: 'Cá Rô',
            slug: 'ca-ro',
            images: productImages.caRo,
            summary: 'Cá Rô tươi ngon'
        },
        {
            id: 'product-5',
            name: 'Gà cỏ',
            slug: 'ga-co',
            images: productImages.gaCo,
            summary: 'Gà cỏ thả vườn'
        },
        {
            id: 'product-6',
            name: 'Ốc',
            slug: 'oc',
            images: productImages.ocCacLoai,
            summary: 'Ốc các loại tươi ngon'
        },
        {
            id: 'product-7',
            name: 'Cá Lóc',
            slug: 'ca-loc',
            images: productImages.caLoc,
            summary: 'Cá Lóc tươi sống'
        },
        {
            id: 'product-8',
            name: 'Lươn',
            slug: 'luon',
            images: productImages.luon,
            summary: 'Lươn tươi sống'
        },
        {
            id: 'product-9',
            name: 'Cá Chạch',
            slug: 'ca-chach',
            images: productImages.caChach,
            summary: 'Cá Chạch tươi ngon'
        },
        {
            id: 'product-10',
            name: 'Cá Chình',
            slug: 'ca-chinh',
            images: productImages.caChinh,
            summary: 'Cá Chình tươi sống'
        },
        {
            id: 'product-11',
            name: 'Lợn Nít',
            slug: 'lon-nit',
            images: productImages.lonNit,
            summary: 'Lợn Nít thịt thơm ngon'
        },
        {
            id: 'product-12',
            name: 'Ba Ba',
            slug: 'ba-ba',
            images: productImages.baBa,
            summary: 'Ba Ba tươi sống'
        }
    ]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="SẢN PHẨM" showSeeAll={true} slug={`${routes.products}`} />
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
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className={cx('swiper-slide')}>
                                <div className={cx('product-item')}>
                                    <div className={cx('product-link')}>
                                        <div className={cx('product-image-container')}>
                                            <img src={product.images} alt={product.name} className={cx('product-image')} />
                                        </div>
                                        <h3 className={cx('product-name')}>{product.name}</h3>
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

export default Products;
