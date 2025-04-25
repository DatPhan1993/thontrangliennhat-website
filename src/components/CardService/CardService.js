import classNames from 'classnames/bind';
import styles from './CardService.module.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function Card({
    title = 'Default Title',
    summary = 'Default Sumary',
    image = '/images/products/tomcangxanh.jpg', // Default to a known existing image
    createdAt = Date.now(),
    isNew = false,
}) {
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = () => {
        console.log('Image failed to load:', image);
        setImageError(true);
    };

    return (
        <div className={cx('card')}>
            {isNew && <span className={cx('new-label')}>NEW</span>}
            <div className={cx('card_image-wrapper')}>
                <img 
                    src={imageError ? '/images/products/tomcangxanh.jpg' : image} 
                    alt={title} 
                    className={cx('card_image')} 
                    onError={handleImageError}
                />
            </div>
            <div className={cx('card_content')}>
                <h3 className={cx('card_title')}>{title}</h3>
                <p className={cx('card_description')}>{summary}</p>
            </div>
        </div>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
};

export default Card;
