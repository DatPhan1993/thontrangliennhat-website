import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { format } from 'date-fns';
import styles from './News.module.scss';
import { Helmet } from 'react-helmet';

// Import dummy data
import newsData from '../../assets/dummy/news';

const cx = classNames.bind(styles);

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("newest");

    useEffect(() => {
        setLoading(true);
        try {
            // Process news data based on active tab
            let filteredNews = [...newsData];
            
            if (activeTab === "newest") {
                filteredNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (activeTab === "featured") {
                filteredNews.sort((a, b) => b.views - a.views);
            } else if (activeTab === "random") {
                filteredNews.sort(() => Math.random() - 0.5);
            }
            
            setNews(filteredNews);
            setLoading(false);
        } catch (err) {
            console.error("Error loading news:", err);
            setLoading(false);
        }
    }, [activeTab]);

    // Function to format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <article className={cx('wrapper')}>
            <Helmet>
                <title>Tin Tức | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật</title>
                <meta
                    name="description"
                    content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật hoạt động đa ngành nghề, trong đó tiêu biểu có thể kể đến là nuôi cá lồng, cải tạo nâng cấp vườn cây quanh các hồ thủy điện, phát triển về du lịch sinh thái, du lịch nông nghiệp."
                />
                <meta 
                    name="keywords" 
                    content="tin tức, cập nhật, thontrangliennhat" 
                />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('inner')}>
                <h2 className={cx('news-title')}>TIN TỨC</h2>
                <div className={cx('news-container')}>
                    {news.map((newsItem) => (
                        <div key={newsItem.id} className={cx('news-item')}>
                            <Link to={`${routes.news}/${newsItem.slug}`} className={cx('news-link')}>
                                <div className={cx('news-image-container')}>
                                    <img 
                                        src={newsItem.images} 
                                        alt={newsItem.title} 
                                        className={cx('news-image')}
                                        onError={(e) => {
                                            console.log('Image error:', e.target.src);
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
                                        }}
                                    />
                                </div>
                                <div className={cx('news-content')}>
                                    <h3>{newsItem.title}</h3>
                                    <p className={cx('news-summary')}>{newsItem.summary}</p>
                                    <div className={cx('news-meta')}>
                                        <span className={cx('news-views')}>
                                            👁️ {newsItem.views}
                                        </span>
                                        <span className={cx('news-date')}>{formatDate(newsItem.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className={cx('news-tabs')}>
                    <button
                        className={classNames(cx('tab'), {
                            [cx('active')]: activeTab === "newest",
                        })}
                        onClick={() => setActiveTab("newest")}
                    >
                        MỚI NHẤT
                    </button>
                    <button
                        className={classNames(cx('tab'), {
                            [cx('active')]: activeTab === "featured",
                        })}
                        onClick={() => setActiveTab("featured")}
                    >
                        NỔI BẬT
                    </button>
                    <button
                        className={classNames(cx('tab'), {
                            [cx('active')]: activeTab === "random",
                        })}
                        onClick={() => setActiveTab("random")}
                    >
                        NGẪU NHIÊN
                    </button>
                </div>
            </div>
        </article>
    );
};

export default News;
