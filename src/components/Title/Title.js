import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Title.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Title({ text, showSeeAll = false, slug, categoryId }) {
    return (
        <div className={cx('header')}>
            <span className={cx('title')}>{text}</span>
            {showSeeAll && (
                <Link
                    to={{
                        pathname: slug,
                        state: { categoryId },
                    }}
                >
                    <button className={cx('see-all')}>Xem thêm</button>
                </Link>
            )}
            <div className={cx('line')} />
        </div>
    );
}

Title.propTypes = {
    text: PropTypes.string.isRequired,
    showSeeAll: PropTypes.bool,
    slug: PropTypes.string,
    categoryId: PropTypes.string,
};

export default Title;
