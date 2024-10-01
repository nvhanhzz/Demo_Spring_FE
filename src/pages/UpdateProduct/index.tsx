import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetails, updateProductDetails } from '../../services/productService';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const UpdateProduct: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null); // State để lưu sản phẩm
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setInitialLoading(true);
            try {
                const response = await getProductDetails(id!);
                const result = await response.json();

                if (result.status === 200) {
                    setProduct(result.data);
                } else {
                    throw new Error(result.message || 'Có lỗi xảy ra khi lấy thông tin sản phẩm');
                }
            } catch (error: any) {
                message.error(error.message || 'Có lỗi xảy ra khi lấy thông tin sản phẩm');
                navigate('/product'); // Quay lại danh sách sản phẩm nếu gặp lỗi
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await updateProductDetails(id!, values);
            console.log(response.status);

            if (response.status === 403) {
                // Nếu mã phản hồi là 403
                message.error('Bạn không đủ quyền');
            } else if (response.ok) {
                // Nếu cập nhật thành công
                message.success('Cập nhật sản phẩm thành công!');
            } else {
                // Nếu có lỗi khác
                const result = await response.json();
                throw new Error(result.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
            }
        } catch (error: any) {
            // Xử lý các lỗi khác không liên quan đến mã trạng thái phản hồi
            message.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Spin tip="Loading..." />;
    }

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <h2>Cập Nhật Sản Phẩm</h2>
            {product && (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        quantity: product.quantity,
                    }}
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
                            Cập Nhật
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => navigate('/product')}
                        >
                            Hủy
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default UpdateProduct;