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

// Ảnh local - static import
import thonTrangImg from './images/thon-trang-lien-nhat.jpg';
import moHinhSinhKeImg from './images/mo-hinh-sinh-ke.jpg';

const cx = classNames.bind(styles);
// Base URL cho hình ảnh - luôn sử dụng HTTPS
const API_URL = process.env.REACT_APP_BASE_URL || "https://api.thontrangliennhat.com";

// Map ảnh tin tức
const newsImagesMap = {
  'thon-trang-lien-nhat.jpg': thonTrangImg,
  'mo-hinh-sinh-ke.jpg': moHinhSinhKeImg
};

function NewsLibrary() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                // Sử dụng axios với timeout để tránh chờ quá lâu
                const response = await axios.get(`${API_URL}/api/news`, { timeout: 8000 });
                // Trực tiếp thay thế đường dẫn ảnh để sử dụng local images
                const processedNews = Array.isArray(response.data) ? response.data.map(item => {
                    const fileName = item.images && item.images.split('/').pop();
                    return {
                        ...item,
                        // Đánh dấu đã xử lý để không phải xử lý lại trong getImageUrl
                        _imageProcessed: true,
                        // Sử dụng local image nếu có, ngược lại giữ nguyên
                        images: fileName && newsImagesMap[fileName] ? newsImagesMap[fileName] : item.images
                    };
                }) : [];
                
                setNews(processedNews.length > 0 ? processedNews : response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news:', err);
                
                // Sử dụng dữ liệu dự phòng nếu không thể kết nối tới API
                const fallbackNews = [
                    {
                        id: 1,
                        title: 'Thôn Trang Liên Nhật chuẩn bị lễ 30-4',
                        summary: 'Mùa hè đã về, Thôn Trang Liên Nhật lại rộn ràng chuẩn bị đón bước chân của những người yêu thiên nhiên, thích khám phá và muốn tìm về chốn bình yên',
                        content: 'Mùa hè đã về, Thôn Trang Liên Nhật lại rộn ràng chuẩn bị đón bước chân của những người yêu thiên nhiên, thích khám phá và muốn tìm về chốn bình yên. Hẹn gặp bạn giữa mênh mông đồng nội, hoa cỏ và nắng vàng!',
                        images: thonTrangImg, // Sử dụng trực tiếp local image
                        _imageProcessed: true,
                        slug: 'lien-nhat',
                        views: 120,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        title: 'Mô hình sinh kế 3 trong 1',
                        summary: 'HTX sản xuất Nông Nghiệp và Dịch vụ tổng hợp Liên Nhật luôn đi theo hướng nông nghiệp sạch, sản xuất nông sản theo hướng hữu cơ',
                        content: 'HTX sản xuất Nông Nghiệp và Dịch vụ tổng hợp Liên Nhật luôn đi theo hướng nông nghiệp sạch, sản xuất nông sản theo hướng hữu cơ, kết hợp nuôi trồng thuỷ sản và các loại hình dịch vụ để thay đổi hướng phát triển nông nghiệp hiện nay.',
                        images: moHinhSinhKeImg, // Sử dụng trực tiếp local image
                        _imageProcessed: true,
                        slug: 'mo-hinh-sinh-ke',
                        views: 85,
                        createdAt: new Date().toISOString()
                    }
                ];
                
                setNews(fallbackNews);
                setError({ message: `Không thể kết nối đến API: ${err.message}` });
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

    // Hàm xử lý URL hình ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return ''; // Trả về chuỗi rỗng nếu không có đường dẫn

        try {
            // Nếu dữ liệu đã được xử lý trong fetchNews, trả về trực tiếp
            if (typeof imagePath === 'object' || imagePath._imageProcessed) {
                return imagePath;
            }

            // Nếu đã là URL đầy đủ hoặc base64, trả về nguyên bản
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
                // Đổi http:// thành https:// để tránh mixed content
                if (imagePath.startsWith('http://')) {
                    return imagePath.replace('http://', 'https://');
                }
                // Loại bỏ các tham chiếu tới localhost
                if (imagePath.includes('localhost')) {
                    // Lấy tên file từ đường dẫn
                    const fileName = imagePath.split('/').pop();
                    // Kiểm tra xem có ảnh local không
                    if (fileName && newsImagesMap[fileName]) {
                        return newsImagesMap[fileName];
                    }
                }
                return imagePath;
            }

            // Xử lý ảnh tin tức
            if (imagePath.includes('images/news/')) {
                // Lấy tên file từ đường dẫn
                const fileName = imagePath.split('/').pop();
                
                // Luôn ưu tiên sử dụng ảnh local đã import
                if (newsImagesMap[fileName]) {
                    return newsImagesMap[fileName];
                }
            }
            
            // Xử lý đường dẫn tương đối
            // Không trả về đường dẫn API, chỉ sử dụng local image
            return '';
        } catch (error) {
            console.error('Error processing image URL:', error);
            // Trả về ảnh mặc định nếu có lỗi
            return '';
        }
    };

    // Xử lý click vào tin tức
    const handleNewsClick = (event, newsItem) => {
        // Nếu có external URL, mở tab mới và ngăn chặn hành vi mặc định
        if (newsItem.externalUrl) {
            event.preventDefault();
            window.open(newsItem.externalUrl, '_blank');
        }
    };

    // Trả về link dựa trên tin tức
    const getNewsLink = (newsItem) => {
        // Nếu có external URL, giữ nguyên link trong app
        // Hàm handleNewsClick sẽ xử lý việc mở link bên ngoài
        return `${routes.news}/${newsItem.slug}`;
    };

    if (error && news.length === 0) {
        return <div>Error loading news: {error.message}</div>;
    }

    if (loading && news.length === 0) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="TIN TỨC" showSeeAll={true} slug={`${routes.news}`} />
                <div className={cx('news-container')}>
                    {news.map((newsItem) => (
                        <div key={newsItem.id} className={cx('news-item')}>
                            <Link 
                                to={getNewsLink(newsItem)} 
                                className={cx('news-link')}
                                onClick={(e) => handleNewsClick(e, newsItem)}
                            >
                                <div className={cx('news-image-container')}>
                                    <img 
                                        src={newsItem._imageProcessed ? newsItem.images : getImageUrl(newsItem.images)} 
                                        alt={newsItem.title} 
                                        className={cx('news-image')} 
                                    />
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
            </div>
        </div>
    );
}

export default NewsLibrary;
