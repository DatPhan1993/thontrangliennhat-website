import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NewsLibrary.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import { format } from 'date-fns';

// Import dummy data instead of making API calls
import newsData from '../../../assets/dummy/news';

const cx = classNames.bind(styles);

function NewsLibrary() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("newest");

    useEffect(() => {
        // Instead of API call, use the dummy data
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
            setError("Failed to load news");
            setLoading(false);
            console.error("Error loading news:", err);
        }
    }, [activeTab]); // Dependency on activeTab to reload when tab changes

    // Function to format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    // Function to get the appropriate link for each news item
    const getNewsLink = (newsItem) => {
        // External links for specific news items
        if (newsItem.id === 6) {
            return "https://baohatinh.vn/cac-khu-du-lich-sinh-thai-o-ha-tinh-chuan-bi-gi-khi-he-sang-post285932.html?zarsrc=30&utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&fbclid=IwY2xjawJ3OftleHRuA2FlbQIxMQBicmlkETFNMElER1JRSVdtVXJKeEJUAR6crDa5eir5e89LX-5lgRFT5x1PNHUxYSqUPwJcPrRdO6mk9kFv2kcnrzgWMQ_aem_nD_cIJ7EdPRKMGXX6qo6Eg";
        } else if (newsItem.id === 5) {
            return "https://vtvgo.vn/ts/13331774?fbclid=IwY2xjawJ3Oi9leHRuA2FlbQIxMQBicmlkETFNMElER1JRSVdtVXJKeEJUAR5DVR52JSkKK1oJB-DEhzmjf-MhE7itNaVexAf4ISk0Yop28RMHnBotKWIqvw_aem_hauQvtqdVDEcmo4soLp0kw";
        } else if (newsItem.id === 4) {
            return "https://donghanhdulich.com/dia-danh/10-mon-an-ha-tinh-ngon-khong-can-chung-minh-an-mot-lan-la-nho-mai.html";
        }
        // Default internal route for other news items
        return `${routes.news}/${newsItem.slug}`;
    };

    // Function to determine if link should open in new tab
    const shouldOpenInNewTab = (newsItem) => {
        return newsItem.id === 4 || newsItem.id === 5 || newsItem.id === 6;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="TIN TỨC" showSeeAll={true} slug={`${routes.news}`} />
                <div className={cx('news-container')}>
                    {news.map((newsItem) => {
                        const newsLink = getNewsLink(newsItem);
                        const openInNewTab = shouldOpenInNewTab(newsItem);
                        
                        return (
                            <div key={newsItem.id} className={cx('news-item')}>
                                {openInNewTab ? (
                                    <a 
                                        href={newsLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={cx('news-link')}
                                    >
                                        <div className={cx('news-image-container')}>
                                            <img src={newsItem.images} alt={newsItem.title} className={cx('news-image')} />
                                        </div>
                                        <div className={cx('news-content')}>
                                            <h3 className={cx('news-title')}>{newsItem.title}</h3>
                                            <p className={cx('news-summary')}>{newsItem.summary}</p>
                                            <div className={cx('news-meta')}>
                                                <span className={cx('news-views')}>
                                                    👁️ {newsItem.views}
                                                </span>
                                                <span className={cx('news-date')}>{formatDate(newsItem.createdAt)}</span>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <Link to={newsLink} className={cx('news-link')}>
                                        <div className={cx('news-image-container')}>
                                            <img src={newsItem.images} alt={newsItem.title} className={cx('news-image')} />
                                        </div>
                                        <div className={cx('news-content')}>
                                            <h3 className={cx('news-title')}>{newsItem.title}</h3>
                                            <p className={cx('news-summary')}>{newsItem.summary}</p>
                                            <div className={cx('news-meta')}>
                                                <span className={cx('news-views')}>
                                                    👁️ {newsItem.views}
                                                </span>
                                                <span className={cx('news-date')}>{formatDate(newsItem.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
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
        </div>
    );
}

export default NewsLibrary;
