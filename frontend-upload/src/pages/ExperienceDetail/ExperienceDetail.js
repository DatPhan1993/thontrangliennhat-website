import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ExperienceDetail.module.scss';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import PushNotification from '~/components/PushNotification/PushNotification';
import DateTime from '~/components/DateTime/DateTime';
import Title from '~/components/Title/Title';
import { getExperienceById } from '~/services/experienceService';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const ExperienceDetail = () => {
    const { slug } = useParams();
    const [experienceDetail, setExperienceDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperienceDetail = async () => {
            try {
                const data = await getExperienceById(slug);
                setExperienceDetail(data);
            } catch (error) {
                setError(error);
                console.error('Error fetching experience detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperienceDetail();
    }, [slug]);

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
                <title>{`${experienceDetail.title} | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật`}</title>
                <meta name="description" content={experienceDetail.summary} />
                <meta name="keywords" content={`dịch vụ du lịch, ${experienceDetail.title}, thontrangliennhat`} />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('header')}>
                <Title text={`${experienceDetail.name}`} className={cx('title')} />
            </div>
            <div className={cx('content')} dangerouslySetInnerHTML={{ __html: experienceDetail.content }} />
            <DateTime timestamp={experienceDetail.created_at} showDate={true} showTime={true} showViews={false} />
        </article>
    );
};

export default ExperienceDetail;
