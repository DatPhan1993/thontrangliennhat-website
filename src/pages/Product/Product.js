import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { getProductsByCategory } from '~/services/productService';
import styles from './Product.module.scss';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from 'services/categoryService';
import Product from '~/components/Product/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const Products = () => {
    const [, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoriesAndProducts = async () => {
            try {
                const categoriesData = await getCategoriesBySlug('san-pham');
                setCategories(categoriesData);

                const groupedProductsMap = {};

                await Promise.all(
                    categoriesData.map(async (category) => {
                        const productsData = await getProductsByCategory(category.id);
                        groupedProductsMap[category.id] = productsData.map((item) => ({
                            ...item,
                        }));
                    }),
                );

                setGroupedProducts(groupedProductsMap);
                setProducts(Object.values(groupedProductsMap).flat());
            } catch (error) {
                setError(error);
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriesAndProducts();
    }, []);

    const getCategorySlug = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.slug : 'unknown';
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Sản Phẩm | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp. Ngoài ra còn thực hiện sản xuất các loại thực phẩm như chả cá, trái cây thực phẩm sấy khô và sấy dẻo, các loại tinh dầu tự nhiên,…"
                />
                <meta
                    name="keywords"
                    content="dịch vụ nông nghiệp du lịch, hợp tác xã, sản phẩm nông nghiệp, thontrangliennhat"
                />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('products-section')}>
                <div className={cx('products-column')}>
                    <h2 className={cx('products-title')}>Sản Phẩm</h2>
                    {categories.map((category) => {
                        const productsInCategory = groupedProducts[category.id];

                        if (!productsInCategory || productsInCategory.length === 0) {
                            return null;
                        }

                        const shouldLoop = productsInCategory.length > 3;

                        return (
                            <div key={category.id} className={cx('products-category')}>
                                <Title
                                    text={category.title || 'Loading...'}
                                    showSeeAll={true}
                                    slug={`${routes.products}/${category.slug}`}
                                    categoryId={category.id}
                                />
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={4}
                                    breakpoints={{
                                        1280: { slidesPerView: 3 },
                                        1024: { slidesPerView: 3 },
                                        768: { slidesPerView: 2 },
                                        0: { slidesPerView: 1 },
                                    }}
                                    loop={shouldLoop}
                                    modules={[Autoplay]}
                                    autoplay={{
                                        delay: 2000,
                                        disableOnInteraction: false,
                                    }}
                                >
                                    {productsInCategory.slice(0, 6).map((item) => (
                                        <SwiperSlide key={item.id} className={cx('slide')}>
                                            <Product
                                                name={item.name}
                                                image={item.images[0]}
                                                price={item.price}
                                                views={item.views}
                                                productId={item.id}
                                                category={getCategorySlug(item.categoryid)}
                                                link={`${routes.products}/${getCategorySlug(item)}/${item.id}`}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        );
                    })}
                </div>
            </div>
        </article>
    );
};

export default Products;
