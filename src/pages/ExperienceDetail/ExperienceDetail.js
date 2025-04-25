import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ExperienceDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import DateTime from '~/components/DateTime/DateTime';
import { experiencesData } from '~/data/experiences'; // Import local data
import { categoriesData } from '~/data/categories'; // Import local data
import routes from '~/config/routes';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const ExperienceDetail = () => {
    const { id, category } = useParams();
    const [experienceDetail, setExperienceDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getExperienceDetail = () => {
            try {
                setLoading(true);

                // Parse experience ID or use slug
                let experience = null;
                if (id) {
                    const experienceId = parseInt(id);
                    if (isNaN(experienceId)) {
                        throw new Error('ID trải nghiệm không hợp lệ');
                    }
                    experience = experiencesData.find(exp => exp.id === experienceId);
                } else {
                    // If no ID, use the category param as slug
                    experience = experiencesData.find(exp => exp.slug === category);
                }
                
                if (!experience) {
                    throw new Error('Không tìm thấy trải nghiệm');
                }

                // Check if category slug matches the category of the experience
                const categoryObj = categoriesData.find(cat => cat.slug === category);
                if (categoryObj && categoryObj.id !== experience.categoryId) {
                    // If category doesn't match, redirect to the correct URL
                    const correctCategory = categoriesData.find(cat => cat.id === experience.categoryId);
                    if (correctCategory) {
                        navigate(`${routes.experiences}/${correctCategory.slug}/${experience.id}`, { replace: true });
                        return;
                    }
                }

                // Format experience with content
                const experienceWithContent = {
                    ...experience,
                    content: experience.description || '<p>Chưa có thông tin chi tiết</p>',
                    created_at: experience.createdAt || new Date().toISOString()
                };

                setExperienceDetail(experienceWithContent);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin trải nghiệm:', error.message);
                setError(error);
                setLoading(false);
            }
        };

        getExperienceDetail();
    }, [id, category, navigate]);

    if (error) {
        return (
            <div className={cx('error-container')}>
                <h2>Không thể hiển thị thông tin trải nghiệm</h2>
                <button onClick={() => navigate(routes.experiences)} className={cx('back-button')}>
                    Quay lại trang trải nghiệm
                </button>
            </div>
        );
    }

    if (loading || !experienceDetail) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>{`${experienceDetail.title} | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật`}</title>
                <meta name="description" content={experienceDetail.summary} />
                <meta name="keywords" content={`trải nghiệm du lịch, ${experienceDetail.title}, thontrangliennhat`} />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('experience-container')}>
                {/* Experience Title */}
                <h1 className={cx('title')}>{experienceDetail.title}</h1>

                {/* Experience Image */}
                <div className={cx('experience-image')}>
                    <img
                        src={experienceDetail.images}
                        alt={experienceDetail.title}
                        onError={(e) => {
                            console.log('Lỗi tải ảnh:', experienceDetail.images);
                            e.target.src = '/images/experiences/cau-tre-dem.jpg';
                        }}
                    />
                </div>

                {/* Experience Summary */}
                <div className={cx('experience-summary')}>
                    <p>{experienceDetail.summary}</p>
                </div>

                {/* Experience Content */}
                <div className={cx('experience-content')} dangerouslySetInnerHTML={{ __html: experienceDetail.content }} />

                {/* Experience Date */}
                <div className={cx('experience-date')}>
                    <DateTime timestamp={experienceDetail.created_at} showDate={true} showTime={false} showViews={false} />
                </div>
            </div>
        </div>
    );
};

export default ExperienceDetail;
