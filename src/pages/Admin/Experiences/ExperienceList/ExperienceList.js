import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './ExperienceList.module.scss';
import Title from '~/components/Title';
import routes from '~/config/routes';
import PushNotification from '~/components/PushNotification';
import LoadingScreen from '~/components/LoadingScreen';

const ExperienceList = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call to fetch experiences
            const response = await fetch('/api/experiences');
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setNotification({
                message: 'Có lỗi xảy ra khi tải danh sách trải nghiệm',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa trải nghiệm này không?')) {
            try {
                // TODO: Implement API call to delete experience
                await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
                setNotification({
                    message: 'Xóa trải nghiệm thành công',
                    type: 'success',
                });
                fetchExperiences();
            } catch (error) {
                console.error('Error deleting experience:', error);
                setNotification({
                    message: 'Có lỗi xảy ra khi xóa trải nghiệm',
                    type: 'error',
                });
            }
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className={styles.experienceContainer}>
            <Title className={styles.pageTitle} text="Danh sách trải nghiệm" />
            <div className={styles.actionsContainer}>
                <Link to={routes.addExperience} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm trải nghiệm
                </Link>
            </div>

            <div className={styles.experienceList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Hình ảnh</th>
                            <th>Mô tả</th>
                            <th>Danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences.length > 0 ? (
                            experiences.map((experience) => (
                                <tr key={experience.id}>
                                    <td>{experience.title}</td>
                                    <td>
                                        <img
                                            src={experience.image}
                                            alt={experience.title}
                                            className={styles.experienceImage}
                                        />
                                    </td>
                                    <td>{experience.description}</td>
                                    <td>{experience.category}</td>
                                    <td>
                                        <Link
                                            to={`/admin/edit-experience/${experience.id}`}
                                            className={styles.editButton}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> Sửa
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(experience.id)}
                                            className={styles.deleteButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
        </div>
    );
};

export default ExperienceList; 