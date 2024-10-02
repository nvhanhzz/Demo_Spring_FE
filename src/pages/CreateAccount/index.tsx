import React, { useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../services/accountService';

const { Option } = Select;

const CreateAccount: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await createAccount(values);

            if (response.status === 403) {
                // Bắt lỗi 403 - Không đủ quyền
                message.error('Bạn không đủ quyền để tạo tài khoản.');
                return;
            }

            const result = await response.json();

            if (result.status === 201) {
                message.success('Tạo mới tài khoản thành công!');
                navigate('/account');
                return;
            }

            // Các lỗi khác không phải 201 và không phải 403
            throw new Error(result.message || 'Có lỗi xảy ra khi tạo tài khoản');

        } catch (error: any) {
            // Xử lý lỗi chung
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
            <h2>Thêm Mới Tài Khoản</h2>
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ status: 'active' }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                >
                    <Input placeholder="Nhập username" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="roleId"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select placeholder="Chọn vai trò">
                        <Option value="1">Admin</Option>
                        <Option value="2">User</Option>
                        <Option value="3">Editor</Option>
                        <Option value="4">Manager</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo Mới
                    </Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => navigate('/account')}
                    >
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateAccount;