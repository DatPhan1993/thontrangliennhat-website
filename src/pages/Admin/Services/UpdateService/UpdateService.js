import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getServiceById, updateService } from '~/services/serviceService';
import { getCategoriesBySlug } from '~/services/categoryService';
import CustomEditor from '~/components/CustomEditor';
import PushNotification from '~/components/PushNotification';
import styles from './UpdateService.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '~/components/LoadingScreen';
import routes from '~/config/routes';
import Title from '~/components/Title';
import { Spin } from 'antd';

const UpdateService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [initialValues, setInitialValues] = useState(null);

    const validationSchema = Yup.object({
        title: Yup.string().required('Tiêu đề là bắt buộc'),
        summary: Yup.string().required('Tóm tắt là bắt buộc'),
        image: Yup.mixed().required('Hình ảnh là bắt buộc'),
        categoryId: Yup.string().required('Danh mục là bắt buộc'),
        content: Yup.string().required('Nội dung là bắt buộc'),
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategoriesBySlug('dich-vu');
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };

        const fetchService = async () => {
            try {
                const service = await getServiceById(id);
                setInitialValues({
                    title: service.name,
                    summary: service.summary,
                    image: service.images[0],
                    categoryId: service.child_nav_id,
                    content: service.content,
                });
            } catch (error) {
                console.error('Lỗi khi tải dịch vụ:', error);
            }
        };

        fetchCategories();
        fetchService();
    }, [id]);

    const handleImageUpload = (event, setFieldValue) => {
        const file = event.target.files[0];
        setFieldValue('image', file);
    };
    const handleSubmit = async (values, { resetForm }) => {
        const formData = new FormData();

        formData.append('name', values.title);
        formData.append('summary', values.summary);

        if (values.image) {
            formData.append('images[]', values.image);
        } else {
            formData.append('images[]', initialValues.image);
        }

        formData.append('child_nav_id', values.categoryId);
        formData.append('content', values.content);
        formData.append('isFeatured', values.isFeatured);

        try {
            await updateService(id, formData);
            setNotification({ message: 'Cập nhật dịch vụ thành công!', type: 'success' });
            resetForm();
            setTimeout(() => {
                navigate(routes.serviceList);
            }, 1000);
        } catch (error) {
            setNotification({ message: 'Lỗi khi cập nhật dịch vụ.', type: 'error' });
            console.error('Lỗi khi cập nhật dịch vụ:', error);
        }
    };

    if (!initialValues) {
        return <LoadingScreen />;
    }

    return (
        <div className={styles.editService}>
            <Title text="Cập nhật dịch vụ" />
            {notification.message && <PushNotification message={notification.message} type={notification.type} />}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Tiêu Đề</label>
                            <Field name="title" type="text" className={styles.input} />
                            <ErrorMessage name="title" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="summary">Tóm Tắt</label>
                            <Field name="summary" type="text" className={styles.input} />
                            <ErrorMessage name="summary" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Chọn Hình Ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageUpload(event, setFieldValue)}
                            />
                            <ErrorMessage name="image" component="div" className={styles.error} />
                        </div>
                        {values.image && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={
                                        typeof values.image === 'string'
                                            ? values.image
                                            : URL.createObjectURL(values.image)
                                    }
                                    alt="Service"
                                    className={styles.serviceImage}
                                />
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label htmlFor="categoryId">Danh Mục</label>
                            <Field as="select" name="categoryId" className={styles.input}>
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="div" className={styles.error} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="content">Nội Dung</label>
                            <CustomEditor
                                onChange={(content) => setFieldValue('content', content)}
                                initialValue={values.content}
                            />
                            <ErrorMessage name="content" component="div" className={styles.error} />
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
                            {isSubmitting ? <Spin size="small" /> : 'Cập nhật'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default UpdateService;
