import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const Products = () => {
    const [menuImages, setMenuImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tạo mảng chứa thông tin các ảnh menu
        const images = [];
        for (let i = 1; i <= 12; i++) {
            images.push({
                id: i,
                image: `/images/anhmenu/${i}.jpg`,
            });
        }
        setMenuImages(images);
        setLoading(false);
    }, []);

    const openImageInNewTab = (imageUrl) => {
        window.open(imageUrl, '_blank');
    };

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Thực Đơn | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta
                    name="description"
                    content="Thực đơn đặc sản của HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật với các món ăn đặc trưng địa phương"
                />
                <meta
                    name="keywords"
                    content="thực đơn, ẩm thực, món ăn đặc sản, hợp tác xã, liên nhật"
                />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('products-section')}>
                <div className={cx('products-column')}>
                    <h2 className={cx('products-title')}>Thực Đơn</h2>
                    <div className={cx('products-grid')}>
                        {menuImages.map((item) => (
                            <div 
                                key={item.id} 
                                className={cx('product-item')}
                                onClick={() => openImageInNewTab(item.image)}
                            >
                                <div className={cx('product-image-container')}>
                                    <img 
                                        src={item.image} 
                                        alt={`Thực đơn ${item.id}`} 
                                        className={cx('product-image')}
                                        onError={(e) => {
                                            console.log('Image error:', e.target.src);
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Products;
