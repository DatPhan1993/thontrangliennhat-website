import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import CardExperience from '~/components/CardService';
// import SuggestCard from '~/components/SuggestCard';
import { getExperienceByCategory } from '~/services/experienceService';
import styles from './Experience.module.scss';
import Title from '~/components/Title';
// import ButtonGroup from '~/components/ButtonGroup';
import PushNotification from '~/components/PushNotification';
import LoadingScreen from '~/components/LoadingScreen';
import routes from '~/config/routes';
import { getCategoriesBySlug } from '~/services/categoryService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const Experience = () => {
    // const [experienceItems, setExperienceItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [groupedExperience, setGroupedExperience] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    useEffect(() => {
        const fetchCategoriesAndExperience = async () => {
            try {
                const categoriesData = await getCategoriesBySlug('trai-nghiem');
                setCategories(categoriesData);

                const groupedExperienceMap = {};

                await Promise.all(
                    categoriesData.map(async (category) => {
                        const experienceData = await getExperienceByCategory(category.id);
                        groupedExperienceMap[category.id] = experienceData.map((item) => ({
                            ...item,
                            image: item.images,
                        }));
                    }),
                );

                setGroupedExperience(groupedExperienceMap);
                // setExperienceItems(Object.values(groupedExperienceMap).flat());
            } catch (error) {
                setError(error);
                console.error('Error fetching experience:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoriesAndExperience();
    }, []);

    // const handleButtonClick = (index) => {
    //     setSelectedSuggestion(index);
    // };

    // const getCategorySlug = (categoryId) => {
    //     const category = categories.find((category) => categoryId === category.id);
    //     return category ? category.slug : '';
    // };

    if (error) {
        const errorMessage = error.response ? error.response.data.message : 'Network Error';
        return <PushNotification message={errorMessage} />;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    // const filteredExperienceItems = experienceItems
    //     .filter((item) => {
    //         if (selectedSuggestion === 0) {
    //             return item.isFeatured;
    //         }
    //         if (selectedSuggestion === 1) {
    //             return item.views > 10;
    //         }
    //         return true;
    //     })
    //     .slice(0, 5);

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Trải Nghiệm | HTX NÔNG NGHIỆP - DU LỊCH PHÚ NÔNG BUÔN ĐÔN </title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn Đôn hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp. Ngoài ra còn thực hiện sản xuất các loại thực phẩm như chả cá, trái cây thực phẩm sấy khô và sấy dẻo, các loại tinh dầu tự nhiên,…"
                />
                <meta
                    name="keywords"
                    content="dịch vụ nông nghiệp du lịch, hợp tác xã, sản phẩm nông nghiệp, phunongbuondon"
                />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            <div className={cx('experience-section')}>
                <div className={cx('experience-column')}>
                    <h2 className={cx('experience-title')}>Khu Vực Trải Nghiệm</h2>
                    {categories.map((category) => {
                        const slides = groupedExperience[category.id] || [];
                        const shouldLoop = slides.length > 3;

                        if (slides.length === 0) {
                            return null;
                        }

                        return (
                            <div key={category.id} className={cx('experience-category')}>
                                <Title
                                    text={category.title || 'Loading...'}
                                    showSeeAll={true}
                                    slug={`${routes.experiences}/${category.slug}`}
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
                                            <Link to={`${routes.experiences}/${category.slug}/${item.id}`}>
                                                <CardExperience
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
                {/* <div className={cx('suggest')}>
                    <h2 className={cx('suggest-title')}>Có thể bạn quan tâm</h2>
                    <ButtonGroup buttons={['Nổi bật', 'Xem nhiều']} onButtonClick={handleButtonClick} />
                    <div className={cx('suggest-items')}>
                        {filteredExperienceItems.map((item, index) => (
                            <Link
                                key={index}
                                to={`${routes.experiences}/${getCategorySlug(item.categoryId)}/${item.id}`}
                            >
                                <SuggestCard
                                    title={item.title}
                                    summary={item.summary}
                                    image={item.images}
                                    createdAt={item.createdAt}
                                    views={item.views}
                                />
                            </Link>
                        ))}
                    </div>
                </div> */}
            </div>
        </article>
    );
};

export default Experience;
