import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Products.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';

const cx = classNames.bind(styles);

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`);
                console.log('Products response:', response.data);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching products:', err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (error) {
        return <div>Error loading products: {error.message}</div>;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="SẢN PHẨM" showSeeAll={true} slug={`${routes.products}`} />
                <div className={cx('product-container')}>
                    {products.map((product) => (
                        <div key={product.id} className={cx('product-item')}>
                            <Link to={`${routes.products}/${product.slug}`} className={cx('product-link')}>
                                <div className={cx('product-image-container')}>
                                    <img src={product.images} alt={product.name} className={cx('product-image')} />
                                </div>
                                <h3 className={cx('product-name')}>{product.name}</h3>
                                <div className={cx('product-detail-btn')}>
                                    <span>Xem chi tiết</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Products;
