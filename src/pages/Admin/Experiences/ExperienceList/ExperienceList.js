import React, { useState, useEffect } from 'react';
import styles from './ExperienceList.module.scss';
import { Table, Button, Space, Popconfirm, message, Spin } from 'antd';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Title from '~/components/Title/Title';
import { getExperiences, deleteExperience } from '~/services/experienceService';

const ExperienceList = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const data = await getExperiences();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            message.error('Lỗi khi tải danh sách trải nghiệm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExperience(id);
            message.success('Xóa trải nghiệm thành công');
            fetchExperiences();
        } catch (error) {
            console.error('Error deleting experience:', error);
            message.error('Lỗi khi xóa trải nghiệm');
        }
    };

    const columns = [
        {
            title: 'Tên Trải Nghiệm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (images) => {
                const image = Array.isArray(images) && images.length > 0 ? images[0] : '';
                return image ? <img src={image} alt="Experience" style={{ width: '80px', height: '50px', objectFit: 'cover' }} /> : 'Không có ảnh';
            },
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => new Date(created_at).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Thao Tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/admin/update-experience/${record.id}`}>
                        <Button type="primary">
                            <FontAwesomeIcon icon={faEdit} /> Sửa
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa trải nghiệm này không?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>
                            <FontAwesomeIcon icon={faTrash} /> Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.experienceListContainer}>
            <div className={styles.header}>
                <Title text="Danh Sách Trải Nghiệm" />
                <Link to={routes.addExperience}>
                    <Button type="primary" size="large">
                        <FontAwesomeIcon icon={faPlus} /> Thêm Mới
                    </Button>
                </Link>
            </div>
            {loading ? (
                <div className={styles.spinner}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table columns={columns} dataSource={experiences} rowKey="id" />
            )}
        </div>
    );
};

export default ExperienceList; 