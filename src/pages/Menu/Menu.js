import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Title from '~/components/Title/Title';
import { Helmet } from 'react-helmet';
import LoadingScreen from '~/components/LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const MenuPage = () => {
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Create an array of menu items from the images in the anhmenu directory
        const items = [];
        for (let i = 1; i <= 12; i++) {
            items.push({
                id: i,
                name: `Món ăn ${i}`,
                image: `/images/anhmenu/${i}.jpg`
            });
        }
        
        setMenuItems(items);
        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingScreen isLoading={loading} />;
    }

    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Thực đơn | HTX Nông Nghiệp - Du Lịch Phú Nông Liên Nhật</title>
                <meta
                    name="description"
                    content="Xem thực đơn các món ăn tại HTX Nông Nghiệp - Du Lịch Phú Nông Buôn."
                />
                <meta name="keywords" content="thực đơn, món ăn, phunongbuondon" />
            </Helmet>

            <Title text="Thực đơn" />

            <div className={cx('menu-grid')}>
                {menuItems.map((item) => (
                    <div key={item.id} className={cx('menu-item')}>
                        <div className={cx('menu-item-inner')}>
                            <img className={cx('menu-item-image')} src={item.image} alt={item.name} />
                            <div className={cx('menu-item-details')}>
                                <h2 className={cx('menu-item-name')}>{item.name}</h2>
                                <Button rounded outline rightIcon={<FontAwesomeIcon icon={faChevronRight}/>} className={cx('menu-item-button')}>
                                    Giá tiền
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage; 