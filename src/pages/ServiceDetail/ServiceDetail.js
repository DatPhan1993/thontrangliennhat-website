import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ServiceDetail.module.scss';
import routes from '~/config/routes';
import { servicesData } from '~/data/services'; // Import local data
import { categoriesData } from '~/data/categories'; // Import local data
import DateTime from '~/components/DateTime/DateTime';
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles);

const ServiceDetail = () => {
    const { id, category } = useParams();
    const [serviceDetail, setServiceDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getServiceDetail = () => {
            try {
                setLoading(true);

                // Parse service ID
                const serviceId = parseInt(id);
                if (isNaN(serviceId)) {
                    throw new Error('ID dịch vụ không hợp lệ');
                }

                // Find service by ID in local data
                const service = servicesData.find(service => service.id === serviceId);
                if (!service) {
                    throw new Error('Không tìm thấy dịch vụ');
                }

                // Check category slug match
                const categoryObj = categoriesData.find(cat => cat.slug === category);
                if (!categoryObj || categoryObj.id !== service.categoryId) {
                    const correctCategory = categoriesData.find(cat => cat.id === service.categoryId);
                    if (correctCategory) {
                        navigate(`${routes.services}/${correctCategory.slug}/${service.id}`, { replace: true });
                        return;
                    }
                }

                // Format service with content
                const serviceWithContent = {
                    ...service,
                    content: service.description || '<p>Chưa có thông tin chi tiết</p>',
                    created_at: service.createdAt || new Date().toISOString()
                };

                setServiceDetail(serviceWithContent);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin dịch vụ:', error.message);
                setError(error);
                setLoading(false);
            }
        };

        getServiceDetail();
    }, [id, category, navigate]);

    if (error) {
        return (
            <div className={cx('error-container')}>
                <h2>Không thể hiển thị thông tin dịch vụ</h2>
                <button onClick={() => navigate(routes.services)} className={cx('back-button')}>
                    Quay lại trang dịch vụ
                </button>
            </div>
        );
    }

    if (loading || !serviceDetail) {
        return (
            <div className={cx('loading-container')}>
                <h2>Không tìm thấy thông tin dịch vụ</h2>
                <button onClick={() => navigate(routes.services)} className={cx('back-button')}>
                    Quay lại trang dịch vụ
                </button>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>{`${serviceDetail.name} | HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật`}</title>
                <meta name="description" content={serviceDetail.summary} />
                <meta name="keywords" content={`dịch vụ du lịch, ${serviceDetail.name}, thontrangliennhat`} />
                <meta name="author" content="HTX Nông Nghiệp - Dịch Vụ Tổng Hợp Liên Nhật" />
            </Helmet>
            <div className={cx('service-container')}>
                {/* Service Title */}
                <h1 className={cx('title')}>{serviceDetail.name}</h1>

                {/* Service Image */}
                <div className={cx('service-image')}>
                    <img
                        src={serviceDetail.images}
                        alt={serviceDetail.name}
                        onError={(e) => {
                            console.log('Lỗi tải ảnh:', serviceDetail.images);
                            e.target.src = '/images/services/mo-hinh-sinh-thai.jpg';
                        }}
                    />
                </div>

                {/* Service Summary */}
                <div className={cx('service-summary')}>
                    <p>{serviceDetail.summary}</p>
                </div>

                {/* Service Content */}
                <div className={cx('service-content')} dangerouslySetInnerHTML={{ __html: serviceDetail.content }} />

                {/* Service Price - Only shown if price exists */}
                {serviceDetail.price > 0 && (
                    <div className={cx('service-price')}>
                        <p>
                            Giá: <span>{serviceDetail.discountPrice.toLocaleString('vi-VN')} VNĐ</span>
                            {serviceDetail.discountPrice < serviceDetail.price && (
                                <span className={cx('original-price')}>{serviceDetail.price.toLocaleString('vi-VN')} VNĐ</span>
                            )}
                        </p>
                    </div>
                )}

                {/* Service Date */}
                <div className={cx('service-date')}>
                    <DateTime timestamp={serviceDetail.created_at} showDate={true} showTime={false} showViews={false} />
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
