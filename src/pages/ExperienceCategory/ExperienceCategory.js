import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Title from '~/components/Title/Title';
import styles from './ExperienceCategory.module.scss';
import { Link } from 'react-router-dom';
import CardExperience from '~/components/CardService/CardService';
import routes from '~/config/routes';
import { Helmet } from 'react-helmet';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Empty } from 'antd';
// Import local data instead of using API
import { experiencesData } from '~/data/experiences';
import { categoriesData } from '~/data/categories';

const cx = classNames.bind(styles);

function ExperienceCategory() {
    const location = useLocation();
    const [experience, setExperience] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const experiencePerPage = 12;

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
        // Filter experiences by category from local data
        const fetchExperiencesByCategory = () => {
            if (categoryId) {
                setLoading(true);
                try {
                    // Filter experiences by category ID
                    const filteredExperiences = experiencesData.filter(
                        (experience) => experience.categoryId === categoryId
                    );
                    setExperience(filteredExperiences);
                } catch (error) {
                    console.error('Error filtering experiences:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchExperiencesByCategory();
    }, [categoryId]);

    const indexOfLastExperience = currentPage * experiencePerPage;
    const indexOfFirstExperience = indexOfLastExperience - experiencePerPage;
    const currentExperienceCategory = experience.slice(indexOfFirstExperience, indexOfLastExperience);

    const totalPages = Math.ceil(experience.length / experiencePerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderExperienceCategory = () => {
        if (currentExperienceCategory.length === 0) {
            return (
                <>
                    <div />
                    <Empty className={cx('empty-element')} description="Đang cập nhật..." />
                    <div />
                </>
            );
        }
        return currentExperienceCategory.map((experienceItem, index) => (
            <Link to={`${routes.experiences}/${slug}/${experienceItem.id}`} key={experienceItem.id}>
                <CardExperience
                    key={index}
                    title={experienceItem.title}
                    image={experienceItem.images}
                    summary={experienceItem.summary}
                    createdAt={new Date(experienceItem.createdAt).getTime()}
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
                    content={`Xem các trải nghiệm liên quan đến ${categoryName} tại HTX Nông Nghiệp - Du Lịch Phú Nông Buôn.`}
                />
                <meta name="keywords" content={`${categoryName}, trải nghiệm du lịch, phunongbuondon`} />
                <meta name="author" content="HTX Nông Nghiệp - Du Lịch Phú Nông Buôn" />
            </Helmet>
            {loading ? (
                <LoadingScreen isLoading={loading} />
            ) : (
                <>
                    <Title text={categoryName} />
                    <div className={cx('experienceGrid')}>{renderExperienceCategory()}</div>
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

export default ExperienceCategory;
