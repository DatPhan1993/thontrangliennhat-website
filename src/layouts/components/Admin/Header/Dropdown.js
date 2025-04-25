import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Header.module.scss';

const Dropdown = ({ isVisible, notifications, isUserDropdown }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.dropdown}>
            {isUserDropdown ? (
                <div className={styles.userDropdown}>
                    {notifications.map((item, index) => (
                        <div
                            key={index}
                            className={styles.dropdownItem}
                            onClick={item.action}
                        >
                            <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.notificationDropdown}>
                    {notifications.length === 0 ? (
                        <div className={styles.noNotifications}>Không có thông báo mới</div>
                    ) : (
                        notifications.map((notification, index) => (
                            <div key={index} className={styles.notificationItem}>
                                <div className={styles.notificationContent}>
                                    {notification.content}
                                </div>
                                <div className={styles.notificationTime}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown; 