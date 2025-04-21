import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './PartnerList.module.scss';
import Title from '~/components/Title';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification';
import LoadingScreen from '~/components/LoadingScreen';

const PartnerList = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch partners
            const response = await fetch('/api/partners');
            const data = await response.json();
            setPartners(data);
        } catch (error) {
            console.error('Error fetching partners:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi tải danh sách đối tác',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa đối tác này không?')) {
            try {
                // TODO: Implement API call to delete partner
                await fetch(`/api/partners/${id}`, { method: 'DELETE' });
                setNotification({
                    message: 'Xóa đối tác thành công',
                    type: 'success',
                });
                fetchPartners();
            } catch (error) {
                console.error('Error deleting partner:', error);
                setNotification({
                    message: 'Có lỗi xảy ra khi xóa đối tác',
                    type: 'error',
                });
            }
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className={styles.partnerContainer}>
            <Title className={styles.pageTitle} text="Danh sách đối tác" />
            <div className={styles.actionsContainer}>
                <Link to={routes.addPartner} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm đối tác
                </Link>
            </div>

            <div className={styles.partnerList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên đối tác</th>
                            <th>Logo</th>
                            <th>Website</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.length > 0 ? (
                            partners.map((partner) => (
                                <tr key={partner.id}>
                                    <td>{partner.name}</td>
                                    <td>
                                        <img src={partner.logo} alt={partner.name} className={styles.partnerLogo} />
                                    </td>
                                    <td>
                                        <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                            {partner.website}
                                        </a>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/edit-partner/${partner.id}`}
                                            className={styles.editButton}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(partner.id)}
                                            className={styles.deleteButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default PartnerList; 