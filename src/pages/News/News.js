import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Card from '~/components/CardContent/CardContent';
import SuggestCard from '~/components/SuggestCard/SuggestCard';
import { getNewsByCategory } from '~/services/newsService';
import styles from './News.module.scss';
import Title from '~/components/Title/Title';
import ButtonGroup from '~/components/ButtonGroup/ButtonGroup';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from '~/services/categoryService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Helmet } from 'react-helmet';
import dayjs from 'dayjs';
import 'swiper/css';
import 'swiper/css/autoplay';

const cx = classNames.bind(styles);

const News = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groupedNews, setGroupedNews] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    useEffect(() => {
        const fetchCategoriesAndNews = async () => {
            try {
                const categoriesData = await getCategoriesBySlug('tin-tuc');
                setCategories(categoriesData);

                const groupedNewsMap = {};

                await Promise.all(
                    categoriesData.map(async (category) => {
                        const newsData = await getNewsByCategory(category.id);
                        groupedNewsMap[category.id] = newsData.map((item) => ({
                            ...item,
                            image: item.images,
                            isNew: dayjs().diff(dayjs(item.createdAt), 'day') <= 3,
                        }));
                    }),
                );

                setGroupedNews(groupedNewsMap);
                setNewsItems(Object.values(groupedNewsMap).flat());
            } catch (error) {
                setError(error);
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriesAndNews();
    }, []);

    const handleButtonClick = (index) => {
        setSelectedSuggestion(index);
    };

    const getCategorySlug = (categoryId) => {
        const category = categories.find((category) => categoryId === category.id);
        return category ? category.slug : '';
    };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    const filteredNewsItems = newsItems
        .filter((item) => {
            if (selectedSuggestion === 0) {
                return item.isFeatured;
            }
            if (selectedSuggestion === 1) {
                return item.views > 10;
            }
            return true;
        })
        .slice(0, 5);

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Tin Tức | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp. Ngoài ra còn thực hiện sản xuất các loại thực phẩm như chả cá, trái cây thực phẩm sấy khô và sấy dẻo, các loại tinh dầu tự nhiên,…"
                />
                <meta name="keywords" content="tin tức, cập nhật, thontrangliennhat" />
            </Helmet>
            <div className={cx('news-section')}>
                <div className={cx('news-column')}>
                    <h2 className={cx('news-title')}>Tin Tức</h2>
                    {categories.map((category) => {
                        const slides = groupedNews[category.id]?.slice(0, 6) || [];
                        const shouldLoop = slides.length > 3;

                        return (
                            <div key={category.id} className={cx('news-category')}>
                                <Title
                                    text={category.title || 'Loading...'}
                                    showSeeAll={true}
                                    slug={`${routes.news}/${category.slug}`}
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
                                    {groupedNews[category.id]?.slice(0, 6).map((item, index) => (
                                        <SwiperSlide key={index} className={cx('slide')}>
                                            <Link to={`${routes.news}/${category.slug}/${item.id}`}>
                                                <Card
                                                    title={item.title}
                                                    summary={item.summary}
                                                    image={item.images}
                                                    createdAt={item.createdAt}
                                                    views={item.views}
                                                    isNew={item.isNew}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        );
                    })}
                </div>
                <div className={cx('suggest')}>
                    <h2 className={cx('suggest-title')}>Có thể bạn quan tâm</h2>
                    <ButtonGroup buttons={['Nổi bật', 'Xem nhiều']} onButtonClick={handleButtonClick} />
                    <div className={cx('suggest-items')}>
                        {filteredNewsItems.map((item, index) => (
                            <Link key={index} to={`${routes.news}/${getCategorySlug(item.child_nav_id)}/${item.id}`}>
                                <SuggestCard
                                    title={item.title}
                                    summary={item.summary}
                                    image={item.images}
                                    createdAt={item.createdAt}
                                    views={item.views}
                                    isNew={item.isNew}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default News;
