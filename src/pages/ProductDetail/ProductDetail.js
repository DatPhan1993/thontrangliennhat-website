import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import Title from '~/components/Title/Title';
import { Helmet } from 'react-helmet';
import ProductVariant from '~/components/ProductVariant/ProductVariant';
import { productsData } from '~/data/products';
import { productVariants } from '~/data/productVariants';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const { slug, id } = useParams();
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Find the product by ID from static data
            const foundProduct = productsData.find(p => p.id === parseInt(id));
            
            if (!foundProduct) {
                throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
            }
            
            setProduct(foundProduct);
            
            // Get product variants from product slug
            const productSlug = foundProduct.slug;
            const foundVariants = productVariants[productSlug] || [];
            setVariants(foundVariants);
            setLoading(false);
        } catch (error) {
            setError(error);
            console.error('Lỗi khi tìm thông tin sản phẩm:', error);
            setLoading(false);
        }
    }, [id]);

    if (error) {
        return <PushNotification message={error.message} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>{product.name} | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta name="description" content={`Các món ăn làm từ ${product.name}.`} />
                <meta name="keywords" content={`món ăn, ${product.name}, thontrangliennhat`} />
            </Helmet>

            <Title text={`Các món ăn từ ${product.name}`} />

            <div className={cx('variants-container')}>
                {variants.length > 0 ? (
                    variants.map(variant => (
                        <ProductVariant
                            key={variant.id}
                            image={variant.image}
                            name={variant.name}
                            price={variant.price}
                            description={variant.description}
                        />
                    ))
                ) : (
                    <div className={cx('no-variants')}>
                        <p>Đang cập nhật các món ăn từ {product.name}...</p>
                    </div>
                )}
            </div>
        </article>
    );
};

export default ProductDetail;
