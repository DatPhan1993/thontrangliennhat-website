import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import Title from '~/components/Title/Title';
import { getProductById } from '~/services/productService';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faCircleDot,
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'components/Button/Button';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const { slug } = useParams();
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const data = await getProductById(slug);
                setProductDetail(data);
                console.log(data);
            } catch (error) {
                setError(error);
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [slug]);

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handlePrevClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? productDetail.images.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === productDetail.images.length - 1 ? 0 : prevIndex + 1));
    };

    const handleThumbnailPrevClick = () => {
        setThumbnailStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    const handleThumbnailNextClick = () => {
        const totalImages = productDetail.images.length;
        const remainingImages = totalImages - (thumbnailStartIndex + 1);
        if (remainingImages > 0) {
            setThumbnailStartIndex((prevIndex) => prevIndex + 1);
        } else {
            setThumbnailStartIndex((prevIndex) => prevIndex + remainingImages);
        }
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    const features = productDetail.features ? JSON.parse(productDetail.features) : [];

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>{productDetail.name} | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta name="description" content={`Chi tiết về sản phẩm: ${productDetail.name}.`} />
                <meta name="keywords" content={`sản phẩm, ${productDetail.name}, thontrangliennhat`} />
            </Helmet>

            <div className={cx('product-section')}>
                <div className={cx('thumbnails')}>
                    {thumbnailStartIndex > 0 && (
                        <button
                            className={cx('thumbnail-button', 'thumbnail-prev-button')}
                            onClick={handleThumbnailPrevClick}
                        >
                            <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                    )}
                    <div
                        className={cx('thumbnail-list')}
                        style={{ transform: `translateY(-${thumbnailStartIndex * 155}px)` }}
                    >
                        {productDetail.images
                            .slice(thumbnailStartIndex, thumbnailStartIndex + 4)
                            .map((image, index) => (
                                <div key={thumbnailStartIndex + index} className={cx('thumbnail-item')}>
                                    <img
                                        className={cx('thumbnail-image')}
                                        src={image.replace(/\\/g, '')}
                                        alt={`${productDetail.name} thumbnail ${thumbnailStartIndex + index + 1}`}
                                        onClick={() => handleThumbnailClick(thumbnailStartIndex + index)}
                                    />
                                </div>
                            ))}
                    </div>
                    {thumbnailStartIndex + 4 < productDetail.images.length && (
                        <button
                            className={cx('thumbnail-button', 'thumbnail-next-button')}
                            onClick={handleThumbnailNextClick}
                        >
                            <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                    )}
                </div>

                <div className={cx('product-image')}>
                    <button className={cx('prev-button')} onClick={handlePrevClick}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <div
                        className={cx('main-image-wrapper')}
                        style={{ transform: `translateX(-${currentImageIndex * 600}px)` }}
                    >
                        {productDetail.images.map((image, index) => (
                            <img
                                key={index}
                                className={cx('main-image')}
                                src={image.replace(/\\/g, '')}
                                alt={`${productDetail.name} main ${index + 1}`}
                            />
                        ))}
                    </div>
                    <button className={cx('next-button')} onClick={handleNextClick}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <div className={cx('product-details')}>
                    <h2 className={cx('product-name')}>{productDetail.name}</h2>
                    <ul className={cx('detail-function')}>
                        {/* <h4 className={cx('title-function')}>Thông tin tổng quan:</h4> */}
                        {features.map((feature, index) => (
                            <li key={index} className={cx('txt-function')}>
                                <FontAwesomeIcon className={cx('icon-function')} icon={faCircleDot} /> {feature}
                            </li>
                        ))}
                    </ul>
                    <Button className={cx('contact-button')} primary>
                        <FontAwesomeIcon icon={faPhone} className={cx('icon')} />
                        <a href={`tel:${productDetail.phone_number}`}>Liên hệ ngay ({productDetail.phone_number})</a>
                    </Button>
                </div>
            </div>

            <div className={cx('info-section')}>
                <Title text="Chi tiết sản phẩm" />
                <div className={cx('info-content')} dangerouslySetInnerHTML={{ __html: productDetail.content || '' }} />
            </div>
        </article>
    );
};

export default ProductDetail;
