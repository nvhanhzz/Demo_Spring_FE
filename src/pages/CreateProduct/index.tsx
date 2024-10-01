import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productService';

const CreateProduct: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await createProduct(values);

            if (response.status === 403) {
                // Bắt lỗi 403 - Không đủ quyền
                message.error('Bạn không đủ quyền để tạo sản phẩm.');
                return;
            }

            if (response.ok) {
                // Nếu phản hồi thành công
                message.success('Tạo sản phẩm thành công!');
                navigate('/product');
            } else {
                // Các lỗi khác không phải 403 hoặc thành công
                const result = await response.json();
                throw new Error(result.message || 'Có lỗi xảy ra khi tạo sản phẩm');
            }
        } catch (error: any) {
            // Xử lý lỗi khác không mong đợi
            message.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <h2>Tạo Mới Sản Phẩm</h2>
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                >
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber
                        min={0}
                        placeholder="Nhập giá sản phẩm"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber
                        min={0}
                        placeholder="Nhập số lượng sản phẩm"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo Sản Phẩm
                    </Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => navigate('/product')}
                    >
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateProduct;