import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './NewsLibrary.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { parseISO, format } from 'date-fns';
import { vi } from 'date-fns/locale';

const cx = classNames.bind(styles);

function NewsLibrary() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/news`);
                console.log('News response:', response.data);
                setNews(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching news:', err);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString);
            return format(date, 'HH:mm | dd/MM/yyyy', { locale: vi });
        } catch (err) {
            console.error('Error formatting date:', err);
            return dateString;
        }
    };

    if (error) {
        return <div>Error loading news: {error.message}</div>;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="TIN TỨC" showSeeAll={true} slug={`${routes.news}`} />
                <div className={cx('news-container')}>
                    {news.map((newsItem) => (
                        <div key={newsItem.id} className={cx('news-item')}>
                            <Link to={`${routes.news}/${newsItem.slug}`} className={cx('news-link')}>
                                <div className={cx('news-image-container')}>
                                    <img src={newsItem.images} alt={newsItem.title} className={cx('news-image')} />
                                </div>
                                <div className={cx('news-content')}>
                                    <h3 className={cx('news-title')}>{newsItem.title}</h3>
                                    <p className={cx('news-summary')}>{newsItem.summary}</p>
                                    <div className={cx('news-meta')}>
                                        <span className={cx('news-date')}>{formatDate(newsItem.createdAt)}</span>
                                        <span className={cx('news-views')}>{newsItem.views} lượt xem</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className={cx('news-tabs')}>
                    <button className={cx('tab', 'active')}>MỚI NHẤT</button>
                    <button className={cx('tab')}>NỔI BẬT</button>
                    <button className={cx('tab')}>NGẪU NHIÊN</button>
                </div>
            </div>
        </div>
    );
}

export default NewsLibrary;
