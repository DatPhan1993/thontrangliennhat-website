import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import CardService from '~/components/CardService/CardService';
import { servicesData } from '~/data/services';
import { categoriesData } from '~/data/categories'; // Import danh mục từ data local
import styles from './Service.module.scss';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
// import { getCategoriesBySlug } from '~/services/categoryService'; // Không dùng API nữa
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const Service = () => {
    const [categories, setCategories] = useState([]);
    const [groupedService, setGroupedService] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Sử dụng trực tiếp dữ liệu từ categoriesData
            setCategories(categoriesData);

            const groupedServiceMap = {};
            
            // Nhóm dịch vụ theo danh mục sử dụng dữ liệu local
            categoriesData.forEach(category => {
                const servicesByCategory = servicesData.filter(service => 
                    service.categoryId === category.id
                );
                
                groupedServiceMap[category.id] = servicesByCategory.map(item => ({
                    ...item,
                    image: item.images,
                }));
            });

            setGroupedService(groupedServiceMap);
            setLoading(false);
        } catch (error) {
            setError(error);
            console.error('Error processing service data:', error);
            setLoading(false);
        }
    }, []);

    if (error) {
        return <PushNotification message="Có lỗi xảy ra khi tải dữ liệu dịch vụ" />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Dịch Vụ Du Lịch | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
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
            <div className={cx('service-section')}>
                <div className={cx('service-column')}>
                    <h2 className={cx('service-title')}>Dịch Vụ Du Lịch</h2>
                    {categories.map((category) => {
                        const slides = groupedService[category.id] || []; // Make sure to get the right services
                        const shouldLoop = slides.length > 3;

                        if (slides.length === 0) {
                            return null; // Skip empty categories
                        }

                        return (
                            <div key={category.id} className={cx('service-category')}>
                                <Title
                                    text={category.title || 'Loading...'}
                                    showSeeAll={true}
                                    slug={`${routes.services}/${category.slug}`}
                                    categoryId={category.id}
                                />
                                <Swiper
                                    spaceBetween={10}
                                    slidesPerView={3}
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
                                    {slides.map((item, index) => (
                                        <SwiperSlide key={index} className={cx('slide')}>
                                            <Link to={`${routes.services}/${category.slug}/${item.id}`}>
                                                <CardService
                                                    title={item.name}
                                                    summary={item.summary}
                                                    image={item.images}
                                                    createdAt={item.createdAt}
                                                    views={item.views}
                                                />
                                            </Link>
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

export default Service;
