import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faChevronRight, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faFacebook } from '@fortawesome/free-brands-svg-icons';
import companyLogo from '~/assets/images/phunong-logo.png';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('footerLeft', 'footerColumnWide')}>
                    <Link to="/">
                        <img src={companyLogo} alt="Company Logo" className={cx('logo')} />
                    </Link>
                    <h5>HỢP TÁC XÃ PHÚ NÔNG BUÔN ĐÔN</h5>
                    <div className={cx('contactInfo')}>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>Thôn Tân phú , Xã Ea Nuôl , Huyện Buôn Đôn , Đắk Lắk</span>
                        </div>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>+84 961 862 450</span>
                        </div>
                        <div className={cx('contactItem')}>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>htxphunong.buondon@gmail.com</span>
                        </div>
                    </div>
                    <div className={cx('socialIcons')}>
                        <Link to="https://www.facebook.com/profile.php?id=100069322668251">
                            <FontAwesomeIcon icon={faFacebook} />
                        </Link>
                        <Link to="https://www.youtube.com/@HtxPhunongbuondon">
                            <FontAwesomeIcon icon={faYoutube} />
                        </Link>
                    </div>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Thông tin doanh nghiệp</h4>
                    <ul>
                        <li>
                            <Link to={`${routes.about}/ve-chung-toi`}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Về chúng tôi
                            </Link>
                        </li>
                        <li>
                            <Link to={`${routes.about}/lich-su`}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Lịch sử
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Danh mục</h4>
                    <ul>
                        <li>
                            <Link to={routes.products}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.services}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Dịch vụ du lịch
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.experiences}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Trải nghiệm
                            </Link>
                        </li>
                        <li>
                            <Link to={routes.news}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Tin tức
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={cx('footerColumn')}>
                    <h4>Các thông tin khác</h4>
                    <ul>
                        <li>
                            <Link to={routes.contact}>
                                <FontAwesomeIcon className={cx('footer-chevon-icon')} icon={faChevronRight} />
                                Liên hệ với chúng tôi
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={cx('bottomBar')}>
                <p>
                    Copyright 2024 &copy;{' '}
                    <a href="https://phunongbuondon.com/" className={cx('company-name')}>
                        HTX Phú Nông
                    </a>
                    . All Rights Reserved. Thiết kế bởi{' '}
                    <a href="https://www.takatech.com.vn/" className={cx('company-design-name')}>
                        TakaTech
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
