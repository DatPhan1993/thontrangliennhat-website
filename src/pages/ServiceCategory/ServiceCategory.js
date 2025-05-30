import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Title from '~/components/Title/Title';
import styles from './ServiceCategory.module.scss';
import { Link } from 'react-router-dom';
import CardService from '~/components/CardService/CardService';
import routes from '~/config/routes';
import { Helmet } from 'react-helmet';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Empty } from 'antd';
// Import local data instead of using API
import { servicesData } from '~/data/services';
import { categoriesData } from '~/data/categories';

const cx = classNames.bind(styles);

function ServiceCategory() {
    const location = useLocation();
    const [service, setService] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const servicePerPage = 12;

    const extractSlugFromPathname = (pathname) => {
        const parts = pathname.split('/');
        return parts.length > 2 ? parts[2] : null;
    };

    const slug = extractSlugFromPathname(location.pathname);

    useEffect(() => {
        // Find category by slug from local data
        const findCategory = () => {
            const category = categoriesData.find((cat) => cat.slug === slug);
            if (category) {
                setCategoryId(category.id);
                setCategoryName(category.title);
            }
        };

        if (slug) {
            findCategory();
        }
    }, [slug]);

    useEffect(() => {
        // Filter services by category from local data
        const fetchServicesByCategory = () => {
            if (categoryId) {
                setLoading(true);
                try {
                    // Filter services by category ID
                    const filteredServices = servicesData.filter(
                        (service) => service.categoryId === categoryId
                    );
                    setService(filteredServices);
                } catch (error) {
                    console.error('Error filtering services:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchServicesByCategory();
    }, [categoryId]);

    const indexOfLastService = currentPage * servicePerPage;
    const indexOfFirstService = indexOfLastService - servicePerPage;
    const currentServiceCategory = service.slice(indexOfFirstService, indexOfLastService);

    const totalPages = Math.ceil(service.length / servicePerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderServiceCategory = () => {
        if (currentServiceCategory.length === 0) {
            return (
                <>
                    <div />
                    <Empty className={cx('empty-element')} description="Đang cập nhật..." />
                    <div />
                </>
            );
        }
        return currentServiceCategory.map((serviceItem, index) => (
            <Link to={`${routes.services}/${slug}/${serviceItem.id}`} key={serviceItem.id}>
                <CardService
                    key={index}
                    title={serviceItem.name}
                    image={serviceItem.images}
                    summary={serviceItem.summary}
                    createdAt={new Date(serviceItem.createdAt).getTime()}
                />
            </Link>
        ));
    };

    const renderPagination = () => {
        return (
            <div className={cx('pagination')}>
                <div className={cx('pageButton')} onClick={() => handlePageChange(currentPage - 1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <div
                        key={index}
                        className={cx('pageButton', { active: currentPage === index + 1 })}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </div>
                ))}
                <div className={cx('pageButton')} onClick={() => handlePageChange(currentPage + 1)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            </div>
        );
    };

    return (
        <div className={cx('container')}>
            <Helmet>
                <title>{categoryName} | HTX Nông Nghiệp - Du Lịch Phú Nông Liên Nhật</title>
                <meta
                    name="description"
                    content={`Xem các dịch vụ du lịch liên quan đến ${categoryName} trên HTX Nông Nghiệp - Du Lịch Phú Nông Buôn.`}
                />
                <meta name="keywords" content={`${categoryName}, dịch vụ, phunongbuondon`} />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            {loading ? (
                <LoadingScreen isLoading={loading} />
            ) : (
                <>
                    <Title text={categoryName} />
                    <div className={cx('serviceGrid')}>{renderServiceCategory()}</div>
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

export default ServiceCategory;
