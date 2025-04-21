import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import Title from '~/components/Title/Title';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import styles from './Experiences.module.scss';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Import hình ảnh từ assets
import experienceImages from '~/assets/images/experiences';

const cx = classNames.bind(styles);

function Experiences() {
    const [experiences, setExperiences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Danh sách 4 trải nghiệm với 4 ảnh mới
    const customExperiences = [
        {
            id: 'exp-1',
            title: 'Câu cá - Bắt cá ao đầm',
            slug: 'cau-ca-bat-ca',
            summary: 'Trải nghiệm thú vị về câu cá và bắt cá dành cho trẻ em và người lớn',
            images: experienceImages.experience1
        },
        {
            id: 'exp-2',
            title: 'Chợ quê 3 trong 1',
            slug: 'cho-que',
            summary: 'Trải nghiệm mua sắm tại chợ quê với đa dạng sản phẩm nông nghiệp sạch',
            images: experienceImages.experience2
        },
        {
            id: 'exp-3',
            title: 'Mô hình sinh kế',
            slug: 'mo-hinh-sinh-ke',
            summary: 'Tìm hiểu mô hình sinh kế theo quy trình khép kín cho phát triển kinh tế bền vững',
            images: experienceImages.experience3
        },
        {
            id: 'exp-4',
            title: 'Làm thủ công mỹ nghệ',
            slug: 'thu-cong-my-nghe',
            summary: 'Hoạt động tham quan và thực hành các nghề thủ công truyền thống',
            images: experienceImages.experience4
        }
    ];

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/experiences`);
                console.log('Experiences response:', response.data);
                
                // Sử dụng mảng customExperiences thay vì kết hợp với API
                setExperiences(customExperiences);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching experiences:', err);
                // Nếu API lỗi, vẫn hiển thị 4 mục trải nghiệm đã định nghĩa
                setExperiences(customExperiences);
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (error && experiences.length === 0) {
        return <div>Error loading experiences: {error.message}</div>;
    }

    if (loading && experiences.length === 0) {
        return <LoadingScreen isLoading={loading} />;
    }

    const getCategorySlug = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.slug : '';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="KHU VỰC TRẢI NGHIỆM" showSeeAll={true} slug={`${routes.experiences}`} />
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
                        {experiences.map((experience) => (
                            <SwiperSlide key={experience.id} className={cx('swiper-slide')}>
                                <div className={cx('experience-item')}>
                                    <div className={cx('experience-link')}>
                                        <div className={cx('experience-image-container')}>
                                            <img src={experience.images} alt={experience.title} className={cx('experience-image')} />
                                        </div>
                                        <h3 className={cx('experience-title')}>{experience.title}</h3>
                                        <p className={cx('experience-summary')}>{experience.summary}</p>
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

export default Experiences;
