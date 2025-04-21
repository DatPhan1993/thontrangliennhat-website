import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { getExperiences } from '~/services/experienceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CardExperience from '~/components/CardService/CardService';
import Title from '~/components/Title/Title';
import PushNotification from '~/components/PushNotification/PushNotification';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import styles from './Experiences.module.scss';
import axios from 'axios';

const cx = classNames.bind(styles);

function Experiences() {
    const [experiences, setExperiences] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/experiences`);
                console.log('Experiences response:', response.data);
                setExperiences(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching experiences:', err);
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (error) {
        return <div>Error loading experiences: {error.message}</div>;
    }

    if (loading) {
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
                <div className={cx('experience-container')}>
                    {experiences.map((experience) => (
                        <div key={experience.id} className={cx('experience-item')}>
                            <Link to={`${routes.experiences}/${experience.slug}`} className={cx('experience-link')}>
                                <div className={cx('experience-image-container')}>
                                    <img src={experience.images} alt={experience.title} className={cx('experience-image')} />
                                </div>
                                <h3 className={cx('experience-title')}>{experience.title}</h3>
                                <p className={cx('experience-summary')}>{experience.summary}</p>
                                <div className={cx('experience-detail-btn')}>
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

export default Experiences;
