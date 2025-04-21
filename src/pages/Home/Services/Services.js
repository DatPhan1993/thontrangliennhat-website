import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Services.module.scss';
import Title from '~/components/Title/Title';
import routes from '~/config/routes';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';

const cx = classNames.bind(styles);

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/services`);
                console.log('Services response:', response.data);
                setServices(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                console.error('Error fetching services:', err);
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    if (error) {
        return <div>Error loading services: {error.message}</div>;
    }

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Title text="DỊCH VỤ DU LỊCH" showSeeAll={true} slug={`${routes.services}`} />
                <div className={cx('service-container')}>
                    {services.map((service) => (
                        <div key={service.id} className={cx('service-item')}>
                            <Link to={`${routes.services}/${service.slug}`} className={cx('service-link')}>
                                <div className={cx('service-image-container')}>
                                    <img src={service.images} alt={service.name} className={cx('service-image')} />
                                </div>
                                <h3 className={cx('service-name')}>{service.name}</h3>
                                <div className={cx('service-detail-btn')}>
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

export default Services;
